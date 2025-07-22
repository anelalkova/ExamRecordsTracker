package mk.finki.ukim.mk.exam_records.service.domain;

import jakarta.persistence.ManyToOne;
import mk.finki.ukim.mk.exam_records.models.Exam;
import mk.finki.ukim.mk.exam_records.models.Session;
import mk.finki.ukim.mk.exam_records.models.Subject;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ExamDomainService {
    Exam create(Long subjectCode,Long sessionId, LocalDate dateOfExam, Integer numStudents, Integer numRooms, LocalTime startTime, LocalTime endTime);
    List<Exam> findAll();
}
