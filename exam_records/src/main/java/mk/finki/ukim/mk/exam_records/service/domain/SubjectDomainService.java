package mk.finki.ukim.mk.exam_records.service.domain;

import mk.finki.ukim.mk.exam_records.models.Subject;
import mk.finki.ukim.mk.exam_records.models.enumeration.Semester;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface SubjectDomainService {
    Subject findByCode(Long code);
    Subject create(Long code, String name, Integer year, Semester semester, List<Long> staffIds,List<Long> studentIds);
    Subject update(Long code, String name, Integer year, Semester semester, List<Long> staffIds,List<Long> studentIds);
    List<Subject> findAll();
    Page<Subject> findAll(Pageable pageable);
    Subject enroll(Long studentId, Long subjectId);
    Page<Subject> findAllForStudent(String userEmail, Pageable pageable);
}
