package mk.finki.ukim.mk.exam_records.repository;

import mk.finki.ukim.mk.exam_records.models.Subject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    @Query("SELECT s FROM Subject s WHERE s.code = :code")
    Subject findByCode(@Param("code") Long code);

    Page<Subject> findAll(Pageable pageable);

    @Query("SELECT s FROM Subject s JOIN s.students st WHERE st.id = :studentId")
    Page<Subject> findAllForStudent(@Param("studentId") Long studentId, Pageable pageable);
}
