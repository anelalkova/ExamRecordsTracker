package mk.finki.ukim.mk.exam_records.service.application.impl;

import mk.finki.ukim.mk.exam_records.models.StudentProgram;
import mk.finki.ukim.mk.exam_records.models.User;
import mk.finki.ukim.mk.exam_records.models.UserRole;
import mk.finki.ukim.mk.exam_records.models.constants.Roles;
import mk.finki.ukim.mk.exam_records.models.dto.CreateUserDTO;
import mk.finki.ukim.mk.exam_records.models.dto.DisplayUserDTO;
import mk.finki.ukim.mk.exam_records.models.dto.StudentCsvImportDTO;
import mk.finki.ukim.mk.exam_records.models.dto.UserCsvDTO;
import mk.finki.ukim.mk.exam_records.models.exceptions.InvalidArgumentsException;
import mk.finki.ukim.mk.exam_records.repository.StudentProgramRepository;
import mk.finki.ukim.mk.exam_records.repository.UserRepository;
import mk.finki.ukim.mk.exam_records.repository.UserRoleRepository;
import mk.finki.ukim.mk.exam_records.service.application.AdminRegistrationService;
import mk.finki.ukim.mk.exam_records.service.csv.CsvService;
import mk.finki.ukim.mk.exam_records.service.email.EmailService;
import mk.finki.ukim.mk.exam_records.service.utils.PasswordService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AdminRegistrationServiceImpl implements AdminRegistrationService {
    
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final StudentProgramRepository studentProgramRepository;
    private final CsvService csvService;
    private final EmailService emailService;
    private final PasswordService passwordService;
    
    public AdminRegistrationServiceImpl(UserRepository userRepository,
                                      UserRoleRepository userRoleRepository,
                                      StudentProgramRepository studentProgramRepository,
                                      CsvService csvService,
                                      EmailService emailService,
                                      PasswordService passwordService) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.studentProgramRepository = studentProgramRepository;
        this.csvService = csvService;
        this.emailService = emailService;
        this.passwordService = passwordService;
    }
    
    @Override
    public List<DisplayUserDTO> registerStudentsFromCsv(MultipartFile file) {
        List<StudentCsvImportDTO> studentCsvData = csvService.importFromCsv(file, StudentCsvImportDTO.class);
        List<DisplayUserDTO> registeredStudents = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        
        for (StudentCsvImportDTO studentData : studentCsvData) {
            try {
                DisplayUserDTO registeredStudent = registerSingleStudent(studentData);
                registeredStudents.add(registeredStudent);
            } catch (Exception e) {
                errors.add("Failed to register student " + studentData.getEmail() + ": " + e.getMessage());
            }
        }
        
        if (!errors.isEmpty() && registeredStudents.isEmpty()) {
            throw new InvalidArgumentsException("Failed to register any students. Errors: " + String.join(", ", errors));
        }
        
        return registeredStudents;
    }
    
    @Override
    public DisplayUserDTO registerSingleStudent(StudentCsvImportDTO studentData) {
        validateStudentData(studentData);
        
        if (userRepository.findByEmail(studentData.getEmail()).isPresent()) {
            throw new InvalidArgumentsException("User with email " + studentData.getEmail() + " already exists");
        }
        
        UserRole studentRole = userRoleRepository.findByRole(Roles.STUDENT)
                .orElseThrow(() -> new InvalidArgumentsException("Student role not found"));
        
        StudentProgram studentProgram = findStudentProgram(studentData.getStudentProgram());
        
        String temporaryPassword = passwordService.generateRandomPassword();
        String encodedPassword = passwordService.encodePassword(temporaryPassword);
        
        User user = new User(
                studentData.getName(),
                studentData.getSurname(),
                studentData.getEmail(),
                encodedPassword,
                studentRole,
                studentData.getIndexAsLong(),
                studentProgram
        );
        
        User savedUser = userRepository.save(user);
        
        try {
            emailService.sendStudentCredentials(
                    savedUser.getEmail(),
                    savedUser.getName() + " " + savedUser.getSurname(),
                    temporaryPassword
            );
        } catch (Exception e) {
            
        }
        
        return DisplayUserDTO.from(savedUser);
    }
    
    @Override
    public void sendCredentialsEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidArgumentsException("User not found"));
        
        if (!user.isStudent()) {
            throw new InvalidArgumentsException("User is not a student");
        }
        
        String temporaryPassword = passwordService.generateRandomPassword();
        String encodedPassword = passwordService.encodePassword(temporaryPassword);
        
        user.setPassword(encodedPassword);
        user.setIsFirstLogin(true);
        userRepository.save(user);
        
        emailService.sendStudentCredentials(
                user.getEmail(),
                user.getName() + " " + user.getSurname(),
                temporaryPassword
        );
    }
    @Override
    @Transactional
    public DisplayUserDTO registerUser(UserCsvDTO dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new InvalidArgumentsException("User with email " + dto.getEmail() + " already exists");
        }
        UserRole role = userRoleRepository.findByRole(dto.getRole())
                .orElseThrow(() -> new InvalidArgumentsException("Role not found: " + dto.getRole()));

        StudentProgram program = null;
        Long index = null;

        if ("ROLE_STUDENT".equals(dto.getRole())) {
            if (dto.getStudentProgram() == null || dto.getStudentProgram().isEmpty()) {
                throw new InvalidArgumentsException("Student program is required for students");
            }
            program = studentProgramRepository.findAll().stream()
                    .filter(sp -> sp.getName().equalsIgnoreCase(dto.getStudentProgram().trim()))
                    .findFirst()
                    .orElseThrow(() -> new InvalidArgumentsException("Student program not found: " + dto.getStudentProgram()));

            if (dto.getIndex() != null && !dto.getIndex().isEmpty()) {
                index = Long.parseLong(dto.getIndex());
            }
        }

        String temporaryPassword = passwordService.generateRandomPassword();
        String encodedPassword = passwordService.encodePassword(temporaryPassword);

        User user = new User(
                dto.getName(),
                dto.getSurname(),
                dto.getEmail(),
                encodedPassword,
                role,
                index,
                program
        );

        user.setIsFirstLogin(true);
        User savedUser = userRepository.save(user);

        emailService.sendStudentCredentials(
                savedUser.getEmail(),
                savedUser.getName() + " " + savedUser.getSurname(),
                temporaryPassword
        );

        return DisplayUserDTO.from(savedUser);
    }


    private void validateStudentData(StudentCsvImportDTO studentData) {
        if (studentData.getName() == null || studentData.getName().trim().isEmpty()) {
            throw new InvalidArgumentsException("Student name is required");
        }
        if (studentData.getSurname() == null || studentData.getSurname().trim().isEmpty()) {
            throw new InvalidArgumentsException("Student surname is required");
        }
        if (studentData.getEmail() == null || studentData.getEmail().trim().isEmpty()) {
            throw new InvalidArgumentsException("Student email is required");
        }
        if (!isValidEmail(studentData.getEmail())) {
            throw new InvalidArgumentsException("Invalid email format: " + studentData.getEmail());
        }
    }
    
    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }
    
    private StudentProgram findStudentProgram(String programName) {
        if (programName == null || programName.trim().isEmpty()) {
            return studentProgramRepository.findAll().stream()
                    .findFirst()
                    .orElseThrow(() -> new InvalidArgumentsException("No student programs available"));
        }
        
        Optional<StudentProgram> exactMatch = studentProgramRepository.findAll().stream()
                .filter(sp -> sp.getName().equalsIgnoreCase(programName.trim()))
                .findFirst();
        
        if (exactMatch.isPresent()) {
            return exactMatch.get();
        }
        
        Optional<StudentProgram> partialMatch = studentProgramRepository.findAll().stream()
                .filter(sp -> sp.getName().toLowerCase().contains(programName.toLowerCase().trim()))
                .findFirst();
        
        return partialMatch.orElseThrow(() -> 
                new InvalidArgumentsException("Student program not found: " + programName));
    }
}

