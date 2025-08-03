package mk.finki.ukim.mk.exam_records.service.domain;

import mk.finki.ukim.mk.exam_records.models.Exam;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ExamDomainService {
    Exam create(Long subjectCode,Long sessionId, LocalDate dateOfExam, LocalTime startTime, LocalTime endTime);
    List<Exam> findAll();
}
