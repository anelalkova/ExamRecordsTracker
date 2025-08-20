package mk.finki.ukim.mk.exam_records.models;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "room", schema = "exam_records")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Integer capacity;

    public Room(String name, Integer capacity) {
        this.name = name;
        this.capacity = capacity;
    }
}
