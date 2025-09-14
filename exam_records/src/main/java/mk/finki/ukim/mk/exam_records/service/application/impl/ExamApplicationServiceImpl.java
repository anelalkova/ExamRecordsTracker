package mk.finki.ukim.mk.exam_records.service.application.impl;

import mk.finki.ukim.mk.exam_records.models.dto.CreateExamDTO;
import mk.finki.ukim.mk.exam_records.models.dto.DisplayExamDTO;
import mk.finki.ukim.mk.exam_records.models.dto.StudentExamViewDTO;
import mk.finki.ukim.mk.exam_records.models.Exam;
import mk.finki.ukim.mk.exam_records.repository.StudentExamRepository;
import mk.finki.ukim.mk.exam_records.service.application.ExamApplicationService;
import mk.finki.ukim.mk.exam_records.service.domain.impl.ExamDomainServiceImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExamApplicationServiceImpl implements ExamApplicationService {

    private final ExamDomainServiceImpl examDomainService;
    private final StudentExamRepository studentExamRepository;

    public ExamApplicationServiceImpl(ExamDomainServiceImpl examDomainService, StudentExamRepository studentExamRepository) {
        this.examDomainService = examDomainService;
        this.studentExamRepository = studentExamRepository;
    }

    @Override
    public Optional<DisplayExamDTO> create(CreateExamDTO createExamDto) {
        return Optional.of(DisplayExamDTO.from(examDomainService.create(
                createExamDto.subjectCode(),
                createExamDto.sessionId(),
                createExamDto.dateOfExam(),
                createExamDto.startTime(),
                createExamDto.endTime(),
                createExamDto.roomIds()
        )));
    }

    @Override
    public List<DisplayExamDTO> findAll() {
        return examDomainService.findAll().stream().map(DisplayExamDTO::from).collect(Collectors.toList());
    }

    @Override
    public Optional<DisplayExamDTO> register(Long examId, Long studentId) {
        return Optional.of(DisplayExamDTO.from(examDomainService.register(examId, studentId)));
    }

    @Override
    public void attendExam(Long examId, Long studentId) {
        examDomainService.attendExam(examId, studentId);
    }

    @Override
    public void unmarkAttendance(Long examId, Long studentId) {
        examDomainService.unmarkAttendance(examId, studentId);
    }

    @Override
    public Page<DisplayExamDTO> findAllForSubject(Long subjectCode, Pageable pageable) {
        return examDomainService.findAllForSubject(subjectCode, pageable)
                .map(DisplayExamDTO::from);
    }

    @Override
    public Page<StudentExamViewDTO> findAllForSubjectAsStudent(Long subjectCode, Long studentId, Pageable pageable) {
        Page<Exam> examPage = examDomainService.findAllForSubject(subjectCode, pageable);
        
        List<StudentExamViewDTO> studentExamViews = examPage.getContent().stream()
                .map(exam -> {
                    Optional<mk.finki.ukim.mk.exam_records.models.StudentExam> studentExam = 
                            studentExamRepository.findByExamIdAndStudentId(exam.getId(), studentId);
                    
                    boolean isRegistered = studentExam.isPresent();
                    boolean hasAttended = studentExam.map(se -> se.getShowed() != null && se.getShowed()).orElse(false);
                    
                    return StudentExamViewDTO.from(exam, isRegistered, hasAttended);
                })
                .collect(Collectors.toList());
        
        return new PageImpl<>(studentExamViews, pageable, examPage.getTotalElements());
    }
}
