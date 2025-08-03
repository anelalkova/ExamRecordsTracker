package mk.finki.ukim.mk.exam_records.models;

import jakarta.persistence.*;
import lombok.Data;
import mk.finki.ukim.mk.exam_records.models.enumeration.Semester;

import java.util.List;

@Data
@Entity
@Table(name = "subject", schema = "exam_records")
public class Subject {
    @Id
    private Long code;

    private String name;

    private Integer year;

    private Semester semester;

    @ManyToMany
    @JoinTable(
            name = "subject_staff",
            schema = "exam_records",
            joinColumns = @JoinColumn(name = "subject_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> staff;
}