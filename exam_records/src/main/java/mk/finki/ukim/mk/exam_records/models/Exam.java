package mk.finki.ukim.mk.exam_records.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
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

    @ManyToMany
    @JoinTable(
            name = "exam_room_reservation",
            schema = "exam_records",
            joinColumns = @JoinColumn(name = "exam_id"),
            inverseJoinColumns = @JoinColumn(name = "room_id")
    )
    private Set<Room> rooms = new HashSet<>();

    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<StudentExam> studentExams = new HashSet<>();

    public Exam(Subject subject, Session session, LocalDate dateOfExam, LocalTime startTime, LocalTime endTime) {
        this.subject = subject;
        this.session = session;
        this.dateOfExam = dateOfExam;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
