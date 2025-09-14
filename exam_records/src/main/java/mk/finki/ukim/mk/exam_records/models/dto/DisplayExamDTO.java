package mk.finki.ukim.mk.exam_records.models.dto;

import mk.finki.ukim.mk.exam_records.models.Exam;
import mk.finki.ukim.mk.exam_records.models.Session;

import java.time.LocalDate;
import java.time.LocalTime;

public record DisplayExamDTO(Long id,
                             DisplaySubjectDTO subject,
                             Session session,
                             LocalDate dateOfExam,
                             LocalTime startTime,
                             LocalTime endTime) {
    public static DisplayExamDTO from(Exam exam) {
        return new DisplayExamDTO(
                exam.getId(),
                DisplaySubjectDTO.from(exam.getSubject()),
                exam.getSession(),
                exam.getDateOfExam(),
                exam.getStartTime(),
                exam.getEndTime()
        );
    }
}
