package mk.finki.ukim.mk.exam_records.service.application;

import mk.finki.ukim.mk.exam_records.models.dto.CreateExamDTO;
import mk.finki.ukim.mk.exam_records.models.dto.DisplayExamDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ExamApplicationService {
    Optional<DisplayExamDTO> create(CreateExamDTO createExamDto);
    List<DisplayExamDTO>findAll();
    Optional<DisplayExamDTO> register(Long examId, Long studentId);
    void attendExam(Long examId, Long studentId);
    Page<DisplayExamDTO> findAllForSubject(Long subjectCode, Pageable pageable);
}
