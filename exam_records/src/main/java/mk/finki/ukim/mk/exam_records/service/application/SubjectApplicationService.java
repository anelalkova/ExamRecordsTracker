package mk.finki.ukim.mk.exam_records.service.application;

import mk.finki.ukim.mk.exam_records.models.dto.CreateSubjectDTO;
import mk.finki.ukim.mk.exam_records.models.dto.DisplaySubjectDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface SubjectApplicationService {
    Optional<DisplaySubjectDTO> findByCode(Long code);
    Optional<DisplaySubjectDTO> save(CreateSubjectDTO createSubjectDto);
    Optional<DisplaySubjectDTO> update(CreateSubjectDTO createSubjectDto);
    List<DisplaySubjectDTO> findAll();
    Page<DisplaySubjectDTO> findAll(Pageable pageable);
    Optional<DisplaySubjectDTO> enroll(Long studentId, Long subjectId);
    Page<DisplaySubjectDTO> findAllForStudent(String userEmail, Pageable pageable);
    Page<DisplaySubjectDTO> findAllForTeacher(String userEmail, Pageable pageable);
}
