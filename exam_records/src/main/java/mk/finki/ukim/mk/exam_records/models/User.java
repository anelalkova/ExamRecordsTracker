package mk.finki.ukim.mk.exam_records.models;

import jakarta.persistence.*;
import lombok.*;
import mk.finki.ukim.mk.exam_records.models.constants.Roles;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "users", schema = "exam_records")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String surname;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @ManyToOne(optional = false)
    @JoinColumn(name = "role_id")
    private UserRole role;

    private Long index;

    private String studentProgram;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<StudentExam> exams = new HashSet<>();

    @ManyToMany(mappedBy = "students")
    private Set<Subject> subjects = new HashSet<>();

    public User(String name, String surname, String email, String password,
                UserRole role, Long index, String studentProgram) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.role = role;
        this.index = index;
        this.studentProgram = studentProgram;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.getRole()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    public boolean isStudent() {
        return role.getRole().equals(Roles.STUDENT);
    }

    public boolean isTeacher() {
        return role.getRole().equals(Roles.TEACHER);
    }
}