package mk.finki.ukim.mk.exam_records.service.domain.impl;

import mk.finki.ukim.mk.exam_records.models.Semester;
import mk.finki.ukim.mk.exam_records.repository.SemesterRepository;
import mk.finki.ukim.mk.exam_records.service.domain.SemesterDomainService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SemesterDomainServiceImpl implements SemesterDomainService {

    private final SemesterRepository semesterRepository;

    public SemesterDomainServiceImpl(SemesterRepository semesterRepository) {
        this.semesterRepository = semesterRepository;
    }

    @Override
    public Optional<Semester> findById(Long id) {
        return semesterRepository.findById(id);
    }
}
