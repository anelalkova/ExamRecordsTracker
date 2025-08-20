package mk.finki.ukim.mk.exam_records.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(schema = "exam_records")
public class StudentProgram {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    private String name;

    private int year;
}
