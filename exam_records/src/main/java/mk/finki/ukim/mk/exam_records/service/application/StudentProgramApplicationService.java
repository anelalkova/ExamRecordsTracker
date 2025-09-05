package mk.finki.ukim.mk.exam_records.service.application;

import mk.finki.ukim.mk.exam_records.models.dto.CreateStudentProgramDTO;
import mk.finki.ukim.mk.exam_records.models.dto.DisplayStudentProgramDTO;

import java.util.List;
import java.util.Optional;

public interface StudentProgramApplicationService {
    Optional<DisplayStudentProgramDTO> create(CreateStudentProgramDTO createStudentProgramDTO);
    
    List<DisplayStudentProgramDTO> findAll();
    
    Optional<DisplayStudentProgramDTO> findById(Long id);
    
    void deleteById(Long id);
}
