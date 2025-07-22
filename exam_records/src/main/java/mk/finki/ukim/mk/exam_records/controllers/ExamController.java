package mk.finki.ukim.mk.exam_records.controllers;

import mk.finki.ukim.mk.exam_records.models.dto.CreateExamDTO;
import mk.finki.ukim.mk.exam_records.models.dto.DisplayExamDTO;
import mk.finki.ukim.mk.exam_records.models.exceptions.InvalidArgumentsException;
import mk.finki.ukim.mk.exam_records.models.exceptions.PasswordsDoNotMatchException;
import mk.finki.ukim.mk.exam_records.service.application.ExamApplicationService;
import mk.finki.ukim.mk.exam_records.service.application.impl.ExamApplicationServiceImpl;
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

    @GetMapping("/findAll")
    public List<DisplayExamDTO> findAll(){
        return examApplicationService.findAll();
    }

    @PostMapping("/create")
    public ResponseEntity<DisplayExamDTO> create(@RequestBody CreateExamDTO createExamDTO){
        try {
            return examApplicationService.create(createExamDTO)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (InvalidArgumentsException | PasswordsDoNotMatchException exception) {
            return ResponseEntity.badRequest().build();
        }
    }
}
