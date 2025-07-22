package mk.finki.ukim.mk.exam_records.service.domain;

import mk.finki.ukim.mk.exam_records.models.Semester;

import java.util.Optional;

public interface SemesterDomainService {
    Optional<Semester> findById(Long id);
}
