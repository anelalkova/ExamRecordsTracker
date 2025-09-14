package mk.finki.ukim.mk.exam_records.controllers;

import mk.finki.ukim.mk.exam_records.models.dto.*;
import mk.finki.ukim.mk.exam_records.service.application.TeacherApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    private final TeacherApplicationService teacherApplicationService;

    public TeacherController(TeacherApplicationService teacherApplicationService) {
        this.teacherApplicationService = teacherApplicationService;
    }

    @PostMapping("/exams/create")
    public ResponseEntity<DisplayExamDTO> createExam(
            @RequestBody CreateExamDTO createExamDTO,
            @RequestParam Long teacherId) {
        try {
            DisplayExamDTO exam = teacherApplicationService.createExamAsTeacher(createExamDTO, teacherId);
            return ResponseEntity.ok(exam);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/exams")
    public ResponseEntity<List<DisplayExamDTO>> getTeacherExams(@RequestParam Long teacherId) {
        try {
            List<DisplayExamDTO> exams = teacherApplicationService.getExamsForTeacher(teacherId);
            return ResponseEntity.ok(exams);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/exams/{examId}/students")
    public ResponseEntity<List<StudentExamResultDTO>> getStudentsForGrading(
            @PathVariable Long examId,
            @RequestParam Long teacherId) {
        try {
            List<StudentExamResultDTO> students = teacherApplicationService.getStudentsForGrading(examId, teacherId);
            return ResponseEntity.ok(students);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/exams/{examId}/students/{studentId}/grade")
    public ResponseEntity<StudentExamResultDTO> assignGrade(
            @PathVariable Long examId,
            @PathVariable Long studentId,
            @RequestParam BigDecimal grade,
            @RequestParam Long teacherId) {
        try {
            StudentExamResultDTO result = teacherApplicationService.assignGrade(examId, studentId, grade, teacherId);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/grades/assign")
    public ResponseEntity<StudentExamResultDTO> assignGradeByDTO(
            @RequestBody GradeAssignmentDTO gradeAssignment,
            @RequestParam Long teacherId) {
        try {
            StudentExamResultDTO result = teacherApplicationService.assignGrade(
                    gradeAssignment.examId(),
                    gradeAssignment.studentId(),
                    gradeAssignment.grade(),
                    teacherId
            );
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/subjects/{subjectCode}/access")
    public ResponseEntity<Boolean> canAccessSubject(
            @PathVariable Long subjectCode,
            @RequestParam Long teacherId) {
        boolean canAccess = teacherApplicationService.canTeacherAccessSubject(subjectCode, teacherId);
        return ResponseEntity.ok(canAccess);
    }

    @GetMapping("/exams/{examId}/access")
    public ResponseEntity<Boolean> canAccessExam(
            @PathVariable Long examId,
            @RequestParam Long teacherId) {
        boolean canAccess = teacherApplicationService.canTeacherAccessExam(examId, teacherId);
        return ResponseEntity.ok(canAccess);
    }
}
