package mk.finki.ukim.mk.exam_records.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "userrole", schema = "exam_records")
public class UserRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String role;
}
