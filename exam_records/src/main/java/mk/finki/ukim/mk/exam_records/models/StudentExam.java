package mk.finki.ukim.mk.exam_records.models;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter@Entity
@NoArgsConstructor
@Table(name = "student_exam", schema = "exam_records")
public class StudentExam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User student;

    @ManyToOne
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @Column(nullable = false)
    private Boolean showed = false;

    public StudentExam(User student, Exam exam) {
        this.student = student;
        this.exam = exam;
    }
}
