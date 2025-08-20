package mk.finki.ukim.mk.exam_records.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import mk.finki.ukim.mk.exam_records.models.enumeration.Semester;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "subject", schema = "exam_records")
public class Subject {
    @Id
    @Column(name = "code")
    private Long code;

    private String name;

    private Integer year;

    private Semester semester;

    @ManyToMany
    @JoinTable(
            name = "subject_staff",
            schema = "exam_records",
            joinColumns = @JoinColumn(name = "subject_code", referencedColumnName = "code"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> staff;

    @ManyToMany
    @JoinTable(
            name = "student_subject",
            schema = "exam_records",
            joinColumns = @JoinColumn(name = "subject_code", referencedColumnName = "code"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private List<User> students;
}