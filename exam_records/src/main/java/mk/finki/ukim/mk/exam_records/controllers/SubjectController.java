package mk.finki.ukim.mk.exam_records.controllers;

import mk.finki.ukim.mk.exam_records.models.dto.CreateSubjectDTO;
import mk.finki.ukim.mk.exam_records.models.dto.DisplaySubjectDTO;
import mk.finki.ukim.mk.exam_records.models.dto.PageDTO;
import mk.finki.ukim.mk.exam_records.models.exceptions.InvalidArgumentsException;
import mk.finki.ukim.mk.exam_records.models.exceptions.PasswordsDoNotMatchException;
import mk.finki.ukim.mk.exam_records.service.application.SubjectApplicationService;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping("/update/{code}")
    public ResponseEntity<DisplaySubjectDTO> update(
            @PathVariable Long code,
            @RequestBody CreateSubjectDTO createSubjectDTO) {
        try {
            if (!code.equals(createSubjectDTO.code())) {
                throw new InvalidArgumentsException("Code mismatch");
            }
            return subjectApplicationService.update(createSubjectDTO)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (InvalidArgumentsException | PasswordsDoNotMatchException exception) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/find-all")
    public List<DisplaySubjectDTO> findAll() {
        return subjectApplicationService.findAll();
    }

    @GetMapping("/find-all-paged")
    public PageDTO<DisplaySubjectDTO> findAllPaged(Pageable pageable) {
        var page = subjectApplicationService.findAll(pageable);
        return new PageDTO<>(
                page.getContent(),
                page.getTotalElements(),
                page.getNumber(),
                page.getSize(),
                page.getTotalPages()
        );
    }

    @PostMapping("/{subjectId}/enroll")
    public ResponseEntity<DisplaySubjectDTO> enroll(
            @PathVariable Long subjectId,
            @RequestParam Long studentId) {
        return subjectApplicationService.enroll(studentId, subjectId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/find-all-for-student/{userEmail}")
    public PageDTO<DisplaySubjectDTO> findAllForStudent(@PathVariable String userEmail, Pageable pageable) {
        var page = subjectApplicationService.findAllForStudent(userEmail, pageable);
        return new PageDTO<>(
                page.getContent(),
                page.getTotalElements(),
                page.getNumber(),
                page.getSize(),
                page.getTotalPages()
        );
    }

    @GetMapping("/find-all-for-teacher/{userEmail}")
    public PageDTO<DisplaySubjectDTO> findAllForTeacher(@PathVariable String userEmail, Pageable pageable) {
        var page = subjectApplicationService.findAllForTeacher(userEmail, pageable);
        return new PageDTO<>(
                page.getContent(),
                page.getTotalElements(),
                page.getNumber(),
                page.getSize(),
                page.getTotalPages()
        );
    }
}
