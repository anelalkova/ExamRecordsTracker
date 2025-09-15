package mk.finki.ukim.mk.exam_records.service.application.impl;

import mk.finki.ukim.mk.exam_records.models.*;
import mk.finki.ukim.mk.exam_records.models.dto.*;
import mk.finki.ukim.mk.exam_records.repository.StudentExamRepository;
import mk.finki.ukim.mk.exam_records.service.application.TeacherApplicationService;
import mk.finki.ukim.mk.exam_records.service.domain.impl.ExamDomainServiceImpl;
import mk.finki.ukim.mk.exam_records.service.domain.impl.SubjectDomainServiceImpl;
import mk.finki.ukim.mk.exam_records.service.domain.impl.UserDomainServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherApplicationServiceImpl implements TeacherApplicationService {

    private final ExamDomainServiceImpl examDomainService;
    private final SubjectDomainServiceImpl subjectDomainService;
    private final UserDomainServiceImpl userDomainService;
    private final StudentExamRepository studentExamRepository;

    public TeacherApplicationServiceImpl(ExamDomainServiceImpl examDomainService,
                                        SubjectDomainServiceImpl subjectDomainService,
                                        UserDomainServiceImpl userDomainService,
                                        StudentExamRepository studentExamRepository) {
        this.examDomainService = examDomainService;
        this.subjectDomainService = subjectDomainService;
        this.userDomainService = userDomainService;
        this.studentExamRepository = studentExamRepository;
    }

    @Override
    public DisplayExamDTO createExamAsTeacher(CreateExamDTO createExamDTO, Long teacherId) {
        if (!canTeacherAccessSubject(createExamDTO.subjectCode(), teacherId)) {
            throw new IllegalArgumentException("Teacher is not authorized to create exams for this subject");
        }
        
        Exam exam = examDomainService.create(
                createExamDTO.subjectCode(),
                createExamDTO.sessionId(),
                createExamDTO.dateOfExam(),
                createExamDTO.startTime(),
                createExamDTO.endTime(),
                createExamDTO.roomIds()
        );
        
        return DisplayExamDTO.from(exam);
    }

    @Override
    public List<StudentExamResultDTO> getStudentsForGrading(Long examId, Long teacherId) {
        if (!canTeacherAccessExam(examId, teacherId)) {
            throw new IllegalArgumentException("Teacher is not authorized to access this exam");
        }
        
        List<StudentExam> studentExams = studentExamRepository.findAllByExamIdOrderByStudentName(examId);
        return studentExams.stream()
                .map(StudentExamResultDTO::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public StudentExamResultDTO assignGrade(Long examId, Long studentId, BigDecimal grade, Long teacherId) {
        if (!canTeacherAccessExam(examId, teacherId)) {
            throw new IllegalArgumentException("Teacher is not authorized to grade this exam");
        }
        
        if (grade.compareTo(new BigDecimal("5")) < 0 || grade.compareTo(new BigDecimal("10")) > 0) {
            throw new IllegalArgumentException("Grade must be between 5 and 10 (5=failed, 6-10=passed)");
        }
        
        StudentExam studentExam = studentExamRepository.findByExamIdAndStudentId(examId, studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student is not registered for this exam"));
        
        User teacher = userDomainService.findById(teacherId)
                .orElseThrow(() -> new IllegalArgumentException("Teacher not found"));
        
        studentExam.setGrade(grade);
        studentExam.setGradedBy(teacher);
        studentExam.setGradedAt(LocalDateTime.now());
        
        StudentExam savedStudentExam = studentExamRepository.save(studentExam);
        return StudentExamResultDTO.from(savedStudentExam);
    }

    @Override
    public List<DisplayExamDTO> getExamsForTeacher(Long teacherId) {
        User teacher = userDomainService.findById(teacherId)
                .orElseThrow(() -> new IllegalArgumentException("Teacher not found"));
        
        if (!teacher.isTeacher()) {
            throw new IllegalArgumentException("User is not a teacher");
        }
        
        return examDomainService.findAll().stream()
                .filter(exam -> canTeacherAccessExam(exam.getId(), teacherId))
                .map(DisplayExamDTO::from)
                .collect(Collectors.toList());
    }

    @Override
    public boolean canTeacherAccessExam(Long examId, Long teacherId) {
        try {
            Exam exam = examDomainService.findAll().stream()
                    .filter(e -> e.getId().equals(examId))
                    .findFirst()
                    .orElse(null);
            
            if (exam == null) {
                return false;
            }
            
            return canTeacherAccessSubject(exam.getSubject().getCode(), teacherId);
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean canTeacherAccessSubject(Long subjectCode, Long teacherId) {
        try {
            Subject subject = subjectDomainService.findByCode(subjectCode);
            return subject.getStaff().stream()
                    .anyMatch(staff -> staff.getId().equals(teacherId));
        } catch (Exception e) {
            return false;
        }
    }
}
