package mk.finki.ukim.mk.exam_records.controllers;

import mk.finki.ukim.mk.exam_records.models.dto.CreateExamDTO;
import mk.finki.ukim.mk.exam_records.models.dto.DisplayExamDTO;
import mk.finki.ukim.mk.exam_records.models.dto.PageDTO;
import mk.finki.ukim.mk.exam_records.models.exceptions.InvalidArgumentsException;
import mk.finki.ukim.mk.exam_records.models.exceptions.PasswordsDoNotMatchException;
import mk.finki.ukim.mk.exam_records.service.application.impl.ExamApplicationServiceImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
public class ExamController {
    private final ExamApplicationServiceImpl examApplicationService;

    public ExamController(ExamApplicationServiceImpl examApplicationService) {
        this.examApplicationService = examApplicationService;
    }

    @GetMapping("/find-all")
    public List<DisplayExamDTO> findAll() {
        return examApplicationService.findAll();
    }

    @PostMapping("/create")
    public ResponseEntity<DisplayExamDTO> create(@RequestBody CreateExamDTO createExamDTO) {
        try {
            return examApplicationService.create(createExamDTO)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (InvalidArgumentsException | PasswordsDoNotMatchException exception) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/register-for-exam/{examId}")
    public ResponseEntity<DisplayExamDTO> register(
            @PathVariable Long examId,
            @RequestParam Long studentId) {
        try {
            return examApplicationService.register(examId, studentId)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (InvalidArgumentsException exception) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{examId}/students/{studentId}/attendance")
    public ResponseEntity<Void> markAttendance(
            @PathVariable Long examId,
            @PathVariable Long studentId) {
        examApplicationService.attendExam(examId, studentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/all-exams-for-subject/{subjectCode}")
    public PageDTO<DisplayExamDTO> getAllExamsForSubject(@PathVariable Long subjectCode, Pageable pageable) {
        var page = examApplicationService.findAllForSubject(subjectCode, pageable);
        return new PageDTO<>(
                page.getContent(),
                page.getTotalElements(),
                page.getNumber(),
                page.getSize(),
                page.getTotalPages()
        );
    }
}
