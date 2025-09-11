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

    @ManyToOne(optional = false)
    private StudentProgram studentProgram;

    @Column(name = "is_first_login")
    private Boolean isFirstLogin = true;

    @Column(name = "password_reset_token")
    private String passwordResetToken;

    @Column(name = "password_reset_token_expiry")
    private java.time.LocalDateTime passwordResetTokenExpiry;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<StudentExam> exams = new HashSet<>();

    @ManyToMany(mappedBy = "students")
    private Set<Subject> subjects = new HashSet<>();

    public User(String name, String surname, String email, String password,
                UserRole role, Long index, StudentProgram studentProgram) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.role = role;
        this.index = index;
        this.studentProgram = studentProgram;
        this.isFirstLogin = true;
    }
    
    public User(String name, String surname, String email, String password, UserRole role) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.role = role;
        this.isFirstLogin = false; 
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.getRole()));
    }
    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }
    public boolean isStudent() {
        return role.getRole().equals(Roles.STUDENT);
    }
    public boolean isTeacher() {
        return role.getRole().equals(Roles.TEACHER);
    }
    
    public boolean isAdmin() {
        return role.getRole().equals(Roles.ADMIN);
    }
    
    public void markFirstLoginComplete() {
        this.isFirstLogin = false;
    }
    
    public boolean requiresPasswordChange() {
        return Boolean.TRUE.equals(this.isFirstLogin);
    }
    
    public void setPasswordResetToken(String token, java.time.LocalDateTime expiry) {
        this.passwordResetToken = token;
        this.passwordResetTokenExpiry = expiry;
    }
    
    public void clearPasswordResetToken() {
        this.passwordResetToken = null;
        this.passwordResetTokenExpiry = null;
    }
    
    public boolean isPasswordResetTokenValid() {
        return passwordResetToken != null && 
               passwordResetTokenExpiry != null && 
               passwordResetTokenExpiry.isAfter(java.time.LocalDateTime.now());
    }
}