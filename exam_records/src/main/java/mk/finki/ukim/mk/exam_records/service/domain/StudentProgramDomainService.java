package mk.finki.ukim.mk.exam_records.service.domain;

import mk.finki.ukim.mk.exam_records.models.StudentProgram;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface StudentProgramDomainService {
    public Optional<StudentProgram> findById(Long studentProgramId);
}
