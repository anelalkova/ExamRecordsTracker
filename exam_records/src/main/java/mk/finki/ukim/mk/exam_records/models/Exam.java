package mk.finki.ukim.mk.exam_records.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Entity
@NoArgsConstructor
@Table(name = "exam", schema = "exam_records")
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Subject subject;

    @ManyToOne
    private Session session;

    @Column(name = "date")
    private LocalDate dateOfExam;

    private LocalTime startTime;

    private LocalTime endTime;

    public Exam(Subject subject, Session session, LocalDate dateOfExam, LocalTime startTime, LocalTime endTime) {
        this.subject = subject;
        this.session = session;
        this.dateOfExam = dateOfExam;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
