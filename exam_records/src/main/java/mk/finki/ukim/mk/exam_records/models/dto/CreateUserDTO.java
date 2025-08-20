package mk.finki.ukim.mk.exam_records.models.dto;

import mk.finki.ukim.mk.exam_records.models.User;
import mk.finki.ukim.mk.exam_records.models.UserRole;

public record CreateUserDTO(
        String email,
        String password,
        String repeatPassword,
        String name,
        String surname,
        Long index,
        String studentProgram,
        Long roleId
) {
    public User toUser(UserRole role) {
        if (!password.equals(repeatPassword)) {
            throw new IllegalArgumentException("Passwords do not match");
        }
        return new User(name, surname, email, password, role, index, studentProgram);
    }
}
