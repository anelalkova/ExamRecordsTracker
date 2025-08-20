package mk.finki.ukim.mk.exam_records.service.application.impl;

import mk.finki.ukim.mk.exam_records.models.dto.CreateExamDTO;
import mk.finki.ukim.mk.exam_records.models.dto.DisplayExamDTO;
import mk.finki.ukim.mk.exam_records.service.application.ExamApplicationService;
import mk.finki.ukim.mk.exam_records.service.domain.impl.ExamDomainServiceImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExamApplicationServiceImpl implements ExamApplicationService {

    private final ExamDomainServiceImpl examDomainService;

    public ExamApplicationServiceImpl(ExamDomainServiceImpl examDomainService) {
        this.examDomainService = examDomainService;
    }

    @Override
    public Optional<DisplayExamDTO> create(CreateExamDTO createExamDto) {
        return Optional.of(DisplayExamDTO.from(examDomainService.create(
                createExamDto.subjectCode(),
                createExamDto.sessionId(),
                createExamDto.dateOfExam(),
                createExamDto.startTime(),
                createExamDto.endTime()
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
    public Page<DisplayExamDTO> findAllForSubject(Long subjectCode, Pageable pageable) {
        return examDomainService.findAllForSubject(subjectCode, pageable)
                .map(DisplayExamDTO::from);
    }
}
