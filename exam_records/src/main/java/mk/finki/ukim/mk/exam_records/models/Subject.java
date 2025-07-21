package mk.finki.ukim.mk.exam_records.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long code;

    private String name;

    private Integer year;

    @ManyToOne
    private Semester semester;

    @ManyToMany
    @JoinTable(
            name = "subject_staff",
            joinColumns = @JoinColumn(name = "subject_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> staff;
}