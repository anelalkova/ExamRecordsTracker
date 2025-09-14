package mk.finki.ukim.mk.exam_records.models.dto;

import java.math.BigDecimal;

public record GradeAssignmentDTO(
        Long studentId,
        Long examId,
        BigDecimal grade
) {
}
