package mk.finki.ukim.mk.exam_records.controllers;

import mk.finki.ukim.mk.exam_records.models.dto.CreateStudentProgramDTO;
import mk.finki.ukim.mk.exam_records.models.dto.DisplayStudentProgramDTO;
import mk.finki.ukim.mk.exam_records.models.exceptions.InvalidArgumentsException;
import mk.finki.ukim.mk.exam_records.service.application.StudentProgramApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-programs")
public class StudentProgramController {
    private final StudentProgramApplicationService studentProgramApplicationService;

    public StudentProgramController(StudentProgramApplicationService studentProgramApplicationService) {
        this.studentProgramApplicationService = studentProgramApplicationService;
    }

    @PostMapping("/create")
    public ResponseEntity<DisplayStudentProgramDTO> create(@RequestBody CreateStudentProgramDTO createStudentProgramDTO) {
        try {
            return studentProgramApplicationService.create(createStudentProgramDTO)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.badRequest().build());
        } catch (InvalidArgumentsException exception) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/find-all")
    public List<DisplayStudentProgramDTO> findAll() {
        return studentProgramApplicationService.findAll();
    }

    @GetMapping("/find-by-id/{id}")
    public ResponseEntity<DisplayStudentProgramDTO> findById(@PathVariable Long id) {
        return studentProgramApplicationService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        try {
            studentProgramApplicationService.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception exception) {
            return ResponseEntity.badRequest().build();
        }
    }
}
