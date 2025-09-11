package mk.finki.ukim.mk.exam_records.service.application.impl;

import mk.finki.ukim.mk.exam_records.models.Exam;
import mk.finki.ukim.mk.exam_records.models.StudentExam;
import mk.finki.ukim.mk.exam_records.models.Subject;
import mk.finki.ukim.mk.exam_records.models.User;
import mk.finki.ukim.mk.exam_records.models.dto.*;
import mk.finki.ukim.mk.exam_records.models.exceptions.InvalidArgumentsException;
import mk.finki.ukim.mk.exam_records.repository.ExamRepository;
import mk.finki.ukim.mk.exam_records.repository.StudentExamRepository;
import mk.finki.ukim.mk.exam_records.repository.SubjectRepository;
import mk.finki.ukim.mk.exam_records.repository.UserRepository;
import mk.finki.ukim.mk.exam_records.repository.UserRoleRepository;
import mk.finki.ukim.mk.exam_records.service.application.CsvApplicationService;
import mk.finki.ukim.mk.exam_records.service.csv.CsvService;
import mk.finki.ukim.mk.exam_records.service.domain.ExamDomainService;
import mk.finki.ukim.mk.exam_records.service.domain.SubjectDomainService;
import mk.finki.ukim.mk.exam_records.service.domain.UserDomainService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CsvApplicationServiceImpl implements CsvApplicationService {
    
    private final CsvService csvService;
    private final UserDomainService userDomainService;
    private final SubjectDomainService subjectDomainService;
    private final ExamDomainService examDomainService;
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final SubjectRepository subjectRepository;
    private final ExamRepository examRepository;
    private final StudentExamRepository studentExamRepository;
    
    public CsvApplicationServiceImpl(CsvService csvService, 
                                   UserDomainService userDomainService,
                                   SubjectDomainService subjectDomainService,
                                   ExamDomainService examDomainService,
                                   UserRepository userRepository,
                                   UserRoleRepository userRoleRepository,
                                   SubjectRepository subjectRepository,
                                   ExamRepository examRepository,
                                   StudentExamRepository studentExamRepository) {
        this.csvService = csvService;
        this.userDomainService = userDomainService;
        this.subjectDomainService = subjectDomainService;
        this.examDomainService = examDomainService;
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.subjectRepository = subjectRepository;
        this.examRepository = examRepository;
        this.studentExamRepository = studentExamRepository;
    }
    
    @Override
    public byte[] exportUsersToCsv() {
        List<User> users = userDomainService.findAll();
        List<UserCsvDTO> userCsvDTOs = users.stream()
                .map(UserCsvDTO::from)
                .collect(Collectors.toList());
        return csvService.exportUsersToCsv(userCsvDTOs);
    }
    
    @Override
    public byte[] exportUsersByRoleToCsv(String role) {
        var userRole = userRoleRepository.findByRole(role)
                .orElseThrow(() -> new InvalidArgumentsException("Invalid role: " + role));
        
        List<User> users = userDomainService.findAllByRole(userRole);
        List<UserCsvDTO> userCsvDTOs = users.stream()
                .map(UserCsvDTO::from)
                .collect(Collectors.toList());
        return csvService.exportUsersToCsv(userCsvDTOs);
    }
    
    
    @Override
    public byte[] exportStudentsForSubjectToCsv(Long subjectCode) {
        Subject subject = subjectDomainService.findByCode(subjectCode);
        if (subject == null) {
            throw new RuntimeException("Subject not found with code: " + subjectCode);
        }
        
        List<User> enrolledStudents = userRepository.findAll().stream()
                .filter(User::isStudent)
                .filter(user -> user.getSubjects().stream()
                        .anyMatch(s -> s.getCode().equals(subjectCode)))
                .collect(Collectors.toList());
        
        List<StudentSubjectCsvDTO> studentCsvDTOs = enrolledStudents.stream()
                .map(StudentSubjectCsvDTO::from)
                .collect(Collectors.toList());
        
        return csvService.exportStudentsToCsv(studentCsvDTOs);
    }
    
    @Override
    public List<DisplayUserDTO> importStudentsForSubjectFromCsv(Long subjectCode, MultipartFile file) {
        List<StudentSubjectCsvDTO> studentCsvDTOs = csvService.importStudentsFromCsv(file);
        Subject subject = subjectDomainService.findByCode(subjectCode);
        
        return studentCsvDTOs.stream()
                .map(dto -> this.processStudentSubjectCsvRecord(dto, subject))
                .filter(user -> user != null)
                .map(DisplayUserDTO::from)
                .collect(Collectors.toList());
    }
    
    @Override
    public byte[] exportExamRegistrationsToCsv(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new InvalidArgumentsException("Exam not found"));
        
        List<ExamRegistrationCsvDTO> registrationCsvDTOs = exam.getStudentExams().stream()
                .map(ExamRegistrationCsvDTO::from)
                .collect(Collectors.toList());
        
        return csvService.exportExamRegistrationsToCsv(registrationCsvDTOs);
    }
    
    @Override
    public void importExamAttendanceFromCsv(Long examId, MultipartFile file) {
        List<ExamAttendanceCsvDTO> attendanceCsvDTOs = csvService.importExamAttendanceFromCsv(file);
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new InvalidArgumentsException("Exam not found"));
        
        attendanceCsvDTOs.forEach(dto -> {
            User student = userRepository.findByEmail(dto.getEmail())
                    .orElse(null);
            
            if (student != null && student.getIndex() != null && 
                student.getIndex().toString().equals(dto.getIndex())) {
                
                StudentExam studentExam = studentExamRepository
                        .findByStudentIdAndExamId(student.getId(), examId)
                        .orElse(null);
                
                if (studentExam != null) {
                    studentExam.setShowed(dto.isAttended());
                    studentExamRepository.save(studentExam);
                }
            }
        });
    }
    
    @Override
    public byte[] exportNotAttendedStudentsToCsv(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new InvalidArgumentsException("Exam not found"));
        
        List<ExamRegistrationCsvDTO> notAttendedCsvDTOs = exam.getStudentExams().stream()
                .filter(studentExam -> !studentExam.getShowed())
                .map(ExamRegistrationCsvDTO::from)
                .collect(Collectors.toList());
        
        return csvService.exportExamRegistrationsToCsv(notAttendedCsvDTOs);
    }
    
    
    private User processStudentSubjectCsvRecord(StudentSubjectCsvDTO csvDTO, Subject subject) {
        try {
            User student = userRepository.findByEmail(csvDTO.getEmail()).orElse(null);
            if (student != null && student.isStudent()) {
                subjectDomainService.enroll(student.getId(), subject.getCode());
                return student;
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }
}
