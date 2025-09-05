package mk.finki.ukim.mk.exam_records.service.domain;

import mk.finki.ukim.mk.exam_records.models.StudentProgram;

import java.util.List;
import java.util.Optional;

public interface StudentProgramDomainService {
    Optional<StudentProgram> findById(Long studentProgramId);
    
    List<StudentProgram> findAll();
    
    StudentProgram save(StudentProgram studentProgram);
    
    void deleteById(Long id);
}
