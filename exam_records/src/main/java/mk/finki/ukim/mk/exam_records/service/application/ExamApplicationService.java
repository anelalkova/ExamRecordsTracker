package mk.finki.ukim.mk.exam_records.service.application;

import mk.finki.ukim.mk.exam_records.models.dto.CreateExamDTO;
import mk.finki.ukim.mk.exam_records.models.dto.DisplayExamDTO;

import java.util.List;
import java.util.Optional;

public interface ExamApplicationService {
    Optional<DisplayExamDTO> create(CreateExamDTO createExamDto);
    List<DisplayExamDTO>findAll();
}
