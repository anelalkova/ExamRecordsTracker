package mk.finki.ukim.mk.exam_records.repository;

import mk.finki.ukim.mk.exam_records.models.StudentExam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentExamRepository extends JpaRepository<StudentExam, Long> {
    Optional<StudentExam> findByExamIdAndStudentId(Long examId, Long studentId);
    Optional<StudentExam> findByStudentIdAndExamId(Long studentId, Long examId);
    
    List<StudentExam> findAllByExamId(Long examId);
    
    @Query("SELECT se FROM StudentExam se WHERE se.exam.id = :examId ORDER BY se.student.surname, se.student.name")
    List<StudentExam> findAllByExamIdOrderByStudentName(@Param("examId") Long examId);
    
    @Query("SELECT se FROM StudentExam se WHERE se.exam.subject.code = :subjectCode")
    List<StudentExam> findAllBySubjectCode(@Param("subjectCode") Long subjectCode);
}
