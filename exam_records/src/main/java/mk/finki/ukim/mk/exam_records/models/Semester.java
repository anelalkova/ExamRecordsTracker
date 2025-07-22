package mk.finki.ukim.mk.exam_records.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "semester", schema = "exam_records")
public class Semester {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
}
