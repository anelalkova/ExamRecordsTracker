package mk.finki.ukim.mk.exam_records.repository;

import mk.finki.ukim.mk.exam_records.models.StudentExam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentExamRepository extends JpaRepository<StudentExam, Long> {
    Optional<StudentExam> findByExamIdAndStudentId(Long examId, Long studentId);
}
