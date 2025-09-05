package mk.finki.ukim.mk.exam_records.service.domain.impl;

import mk.finki.ukim.mk.exam_records.models.StudentProgram;
import mk.finki.ukim.mk.exam_records.repository.StudentProgramRepository;
import mk.finki.ukim.mk.exam_records.service.domain.StudentProgramDomainService;
import org.springframework.stereotype.Service;

import java.util.List;
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

    @Override
    public List<StudentProgram> findAll() {
        return studentProgramRepository.findAll();
    }

    @Override
    public StudentProgram save(StudentProgram studentProgram) {
        return studentProgramRepository.save(studentProgram);
    }

    @Override
    public void deleteById(Long id) {
        studentProgramRepository.deleteById(id);
    }
}
