package mk.finki.ukim.mk.exam_records.models.dto;

import mk.finki.ukim.mk.exam_records.models.Exam;
import mk.finki.ukim.mk.exam_records.models.Session;

import java.time.LocalDate;
import java.time.LocalTime;

public record StudentExamViewDTO(Long id,
                                 DisplaySubjectDTO subject,
                                 Session session,
                                 LocalDate dateOfExam,
                                 LocalTime startTime,
                                 LocalTime endTime,
                                 boolean isRegistered,
                                 boolean hasAttended) {
    
    public static StudentExamViewDTO from(Exam exam, boolean isRegistered, boolean hasAttended) {
        return new StudentExamViewDTO(
                exam.getId(),
                DisplaySubjectDTO.from(exam.getSubject()),
                exam.getSession(),
                exam.getDateOfExam(),
                exam.getStartTime(),
                exam.getEndTime(),
                isRegistered,
                hasAttended
        );
    }
}
