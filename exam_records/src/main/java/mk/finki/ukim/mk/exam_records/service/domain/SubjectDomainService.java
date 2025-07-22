package mk.finki.ukim.mk.exam_records.service.domain;

import mk.finki.ukim.mk.exam_records.models.Semester;
import mk.finki.ukim.mk.exam_records.models.Subject;
import mk.finki.ukim.mk.exam_records.models.User;

import java.util.List;

public interface SubjectDomainService {
    Subject findByCode(Long code);

    Subject create(Long code, String name, Integer year, Long semesterId, List<Long> staffIds);
    Subject update(Long code, String name, Integer year, Long semesterId, List<Long> staffIds);
}
