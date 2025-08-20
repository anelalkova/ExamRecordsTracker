package mk.finki.ukim.mk.exam_records.repository;

import mk.finki.ukim.mk.exam_records.models.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    @Query("""
    SELECT r FROM Room r
    WHERE r NOT IN (
        SELECT r2 FROM Exam e
        JOIN e.rooms r2
        WHERE e.id = :examId
    )
    AND NOT EXISTS (
        SELECT 1 FROM Exam e
        JOIN e.rooms r2
        WHERE r2 = r
          AND e.id <> :examId
          AND e.dateOfExam = :date
          AND e.startTime < :endTime
          AND e.endTime > :startTime
    )
""")
    List<Room> findAvailableRooms(
            @Param("examId") Long examId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);
}
