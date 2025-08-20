package mk.finki.ukim.mk.exam_records.service.domain.impl;

import jakarta.transaction.Transactional;
import mk.finki.ukim.mk.exam_records.models.Subject;
import mk.finki.ukim.mk.exam_records.models.User;
import mk.finki.ukim.mk.exam_records.models.enumeration.Semester;
import mk.finki.ukim.mk.exam_records.repository.SubjectRepository;
import mk.finki.ukim.mk.exam_records.repository.UserRepository;
import mk.finki.ukim.mk.exam_records.service.domain.SubjectDomainService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SubjectDomainServiceImpl implements SubjectDomainService {

    private final SubjectRepository subjectRepository;
    private final UserDomainServiceImpl userDomainService;
    private final UserRepository userRepository;
    public SubjectDomainServiceImpl(SubjectRepository subjectRepository, UserDomainServiceImpl userDomainService, UserRepository userRepository) {
        this.subjectRepository = subjectRepository;
        this.userDomainService = userDomainService;
        this.userRepository = userRepository;
    }

    @Override
    public Subject findByCode(Long code) {
        return subjectRepository.findByCode(code);
    }

    @Override
    public Subject create(Long code, String name, Integer year, Semester semester, List<Long> staffIds) {
        if (subjectRepository.existsById(code)) {
            throw new IllegalArgumentException("Subject with code " + code + " already exists.");
        }

        Subject subject = new Subject();
        subject.setCode(code);
        subject.setName(name);
        subject.setYear(year);
        subject.setSemester(semester);

        List<User> staff = new ArrayList<>();
        if (staffIds != null && !staffIds.isEmpty()) {
            for (Long id : staffIds) {
                User user = userDomainService.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("User with ID " + id + " not found"));

                if (!"ROLE_TEACHER".equals(user.getRole().getRole())) {
                    throw new IllegalArgumentException("User with ID " + id + " is not a teacher");
                }

                staff.add(user);
            }
        }

        subject.setStaff(staff);
        return subjectRepository.save(subject);
    }

    @Override
    public Subject update(Long code, String name, Integer year, Semester semester, List<Long> staffIds) {
        Subject subject = subjectRepository.findById(code)
                .orElseThrow(() -> new IllegalArgumentException("Subject with code " + code + " not found"));

        subject.setName(name);
        subject.setYear(year);
        subject.setSemester(semester);

        List<User> staff = staffIds.stream()
                .map(userDomainService::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .filter(user -> {
                    String role = user.getRole().getRole();
                    return "ROLE_TEACHER".equals(role);
                })
                .collect(Collectors.toCollection(ArrayList::new));

        subject.setStaff(staff);

        return subjectRepository.save(subject);
    }

    @Override
    public List<Subject> findAll() {
        return subjectRepository.findAll();
    }

    @Override
    public Page<Subject> findAll(Pageable pageable) {
        return subjectRepository.findAll(pageable);
    }

    @Transactional
    public Subject enroll(Long studentId, Long subjectId) {
        User student = userDomainService.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        if (!student.isStudent()) {
            throw new IllegalArgumentException("User is not a student");
        }

        Subject subject = findByCode(subjectId);
        if (subject == null) {
            throw new IllegalArgumentException("Subject with code " + subjectId + " not found");
        }

        subject.getStudents().add(student);

        student.getSubjects().add(subject);

        subjectRepository.save(subject);

        return subject;
    }

    @Override
    public Page<Subject> findAllForStudent(String userEmail, Pageable pageable) {
        User user = userDomainService.findByEmail(userEmail);
        return subjectRepository.findAllForStudent(user.getId(), pageable);
    }
}
