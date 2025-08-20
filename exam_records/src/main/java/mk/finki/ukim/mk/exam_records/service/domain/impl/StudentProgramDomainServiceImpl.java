package mk.finki.ukim.mk.exam_records.service.domain.impl;

import mk.finki.ukim.mk.exam_records.models.StudentProgram;
import mk.finki.ukim.mk.exam_records.repository.StudentProgramRepository;
import mk.finki.ukim.mk.exam_records.service.domain.StudentProgramDomainService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StudentProgramDomainServiceImpl implements StudentProgramDomainService {
    private final StudentProgramRepository studentProgramRepository;

    public StudentProgramDomainServiceImpl(StudentProgramRepository studentProgramRepository) {
        this.studentProgramRepository = studentProgramRepository;
    }

    @Override
    public Optional<StudentProgram> findById(Long studentProgramId) {
        return studentProgramRepository.findById(studentProgramId);
    }
}
