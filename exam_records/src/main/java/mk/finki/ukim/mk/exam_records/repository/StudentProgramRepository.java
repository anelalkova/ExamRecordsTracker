package mk.finki.ukim.mk.exam_records.repository;

import mk.finki.ukim.mk.exam_records.models.StudentProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentProgramRepository extends JpaRepository<StudentProgram, Long> {

}
