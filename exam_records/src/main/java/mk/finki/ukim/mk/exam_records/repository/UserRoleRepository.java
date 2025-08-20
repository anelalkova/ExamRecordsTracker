package mk.finki.ukim.mk.exam_records.repository;

import mk.finki.ukim.mk.exam_records.models.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRoleRepository extends JpaRepository <UserRole, Long>{
    Optional<UserRole> findByRole(String role);

    List<UserRole> role(String role);
}
