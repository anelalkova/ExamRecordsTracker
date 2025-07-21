package mk.finki.ukim.mk.exam_records.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Entity
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @ManyToOne
    private Subject subject;

    @ManyToOne
    private Session session;

    private LocalDate dateOfExam;

    private Integer numStudents;

    private Integer numRooms;

    private LocalTime startTime;

    private LocalTime endTime;
}
