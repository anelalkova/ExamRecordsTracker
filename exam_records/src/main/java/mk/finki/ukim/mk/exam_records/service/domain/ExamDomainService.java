package mk.finki.ukim.mk.exam_records.service.domain;

import mk.finki.ukim.mk.exam_records.models.Exam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ExamDomainService {
    Exam create(Long subjectCode,Long sessionId, LocalDate dateOfExam, LocalTime startTime, LocalTime endTime);
    List<Exam> findAll();
    Exam register(Long examId, Long studentId);
    void attendExam(Long examId, Long studentId);
    Page<Exam> findAllForSubject(Long subjectCode, Pageable pageable);
}
