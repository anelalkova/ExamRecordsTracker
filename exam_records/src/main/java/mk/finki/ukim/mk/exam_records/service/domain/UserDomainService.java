package mk.finki.ukim.mk.exam_records.service.domain;

import mk.finki.ukim.mk.exam_records.models.User;
import mk.finki.ukim.mk.exam_records.models.UserRole;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;
import java.util.Optional;

public interface UserDomainService extends UserDetailsService {
    User login(String email, String password);

    User findByEmail(String email);

    List<User> findAll();

    List<User> findAllByRole(UserRole role);

    Optional<User> findById(Long id);

    Optional<User> getLoggedInUser();

    User update(User user);

    User register(String email, String password, String repeatPassword, String name, String surname, Long index, Long studentProgramId, Long roleId);
}
