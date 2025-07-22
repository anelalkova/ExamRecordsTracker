package mk.finki.ukim.mk.exam_records.service.application;

import mk.finki.ukim.mk.exam_records.models.dto.CreateSubjectDTO;
import mk.finki.ukim.mk.exam_records.models.dto.DisplaySubjectDTO;

import java.util.Optional;

public interface SubjectApplicationService {
    Optional<DisplaySubjectDTO> findByCode(Long code);
    Optional<DisplaySubjectDTO> save(CreateSubjectDTO createSubjectDto);
    Optional<DisplaySubjectDTO> update(CreateSubjectDTO createSubjectDto);
}
