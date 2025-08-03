package mk.finki.ukim.mk.exam_records.controllers;

import mk.finki.ukim.mk.exam_records.models.dto.CreateSubjectDTO;
import mk.finki.ukim.mk.exam_records.models.dto.DisplaySubjectDTO;
import mk.finki.ukim.mk.exam_records.models.exceptions.InvalidArgumentsException;
import mk.finki.ukim.mk.exam_records.models.exceptions.PasswordsDoNotMatchException;
import mk.finki.ukim.mk.exam_records.service.application.SubjectApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {
    private final SubjectApplicationService subjectApplicationService;

    public SubjectController(SubjectApplicationService subjectApplicationService) {
        this.subjectApplicationService = subjectApplicationService;
    }

    @GetMapping("/find-by-code/{code}")
    public ResponseEntity<DisplaySubjectDTO> findByCode(@PathVariable Long code) {
        return subjectApplicationService.findByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<DisplaySubjectDTO> save(@RequestBody CreateSubjectDTO createSubjectDTO) {
        try {
            return subjectApplicationService.save(createSubjectDTO)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (InvalidArgumentsException | PasswordsDoNotMatchException exception) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/update")
    public ResponseEntity<DisplaySubjectDTO> update(@RequestBody CreateSubjectDTO createSubjectDTO) {
        try {
            return subjectApplicationService.update(createSubjectDTO)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (InvalidArgumentsException | PasswordsDoNotMatchException exception) {
            return ResponseEntity.badRequest().build();
        }
    }
}
