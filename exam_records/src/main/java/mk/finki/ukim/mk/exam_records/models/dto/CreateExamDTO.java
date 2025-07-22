package mk.finki.ukim.mk.exam_records.models.dto;

import mk.finki.ukim.mk.exam_records.models.*;

import java.time.LocalDate;
import java.time.LocalTime;

public record CreateExamDTO(Long subjectCode,
                            Long sessionId,
                            LocalDate dateOfExam,
                            Integer numStudents,
                            Integer numRooms,
                            LocalTime startTime,
                            LocalTime endTime) {
    public Exam toExam(Subject subject, Session session) {
        return new Exam(subject, session, dateOfExam, numRooms, numRooms, startTime, endTime);
    }
}

