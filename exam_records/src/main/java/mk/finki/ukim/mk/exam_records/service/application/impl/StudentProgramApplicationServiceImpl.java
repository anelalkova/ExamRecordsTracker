package mk.finki.ukim.mk.exam_records.service.application.impl;

import mk.finki.ukim.mk.exam_records.models.StudentProgram;
import mk.finki.ukim.mk.exam_records.models.dto.CreateStudentProgramDTO;
import mk.finki.ukim.mk.exam_records.models.dto.DisplayStudentProgramDTO;
import mk.finki.ukim.mk.exam_records.service.application.StudentProgramApplicationService;
import mk.finki.ukim.mk.exam_records.service.domain.StudentProgramDomainService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentProgramApplicationServiceImpl implements StudentProgramApplicationService {
    private final StudentProgramDomainService studentProgramDomainService;

    public StudentProgramApplicationServiceImpl(StudentProgramDomainService studentProgramDomainService) {
        this.studentProgramDomainService = studentProgramDomainService;
    }

    @Override
    public Optional<DisplayStudentProgramDTO> create(CreateStudentProgramDTO createStudentProgramDTO) {
        StudentProgram studentProgram = createStudentProgramDTO.toStudentProgram();
        StudentProgram savedStudentProgram = studentProgramDomainService.save(studentProgram);
        return Optional.of(DisplayStudentProgramDTO.from(savedStudentProgram));
    }

    @Override
    public List<DisplayStudentProgramDTO> findAll() {
        return studentProgramDomainService.findAll()
                .stream()
                .map(DisplayStudentProgramDTO::from)
                .toList();
    }

    @Override
    public Optional<DisplayStudentProgramDTO> findById(Long id) {
        return studentProgramDomainService.findById(id)
                .map(DisplayStudentProgramDTO::from);
    }

    @Override
    public void deleteById(Long id) {
        studentProgramDomainService.deleteById(id);
    }
}
