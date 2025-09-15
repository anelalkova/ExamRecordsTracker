package mk.finki.ukim.mk.exam_records.models.dto;

import mk.finki.ukim.mk.exam_records.models.StudentExam;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record StudentExamResultDTO(
        Long id,
        Long studentId,
        String studentName,
        String studentEmail,
        String studentIndex,
        Long examId,
        Boolean attended,
        BigDecimal grade,
        String gradedByName,
        LocalDateTime gradedAt
) {
    public static StudentExamResultDTO from(StudentExam studentExam) {
        return new StudentExamResultDTO(
                studentExam.getId(),
                studentExam.getStudent().getId(),
                studentExam.getStudent().getName() + " " + studentExam.getStudent().getSurname(),
                studentExam.getStudent().getEmail(),
                studentExam.getStudent().getIndex() != null ? 
                    studentExam.getStudent().getIndex().toString() : null,
                studentExam.getExam().getId(),
                studentExam.getShowed(),
                studentExam.getGrade(),
                studentExam.getGradedBy() != null ? 
                    studentExam.getGradedBy().getName() + " " + studentExam.getGradedBy().getSurname() : null,
                studentExam.getGradedAt()
        );
    }
}
