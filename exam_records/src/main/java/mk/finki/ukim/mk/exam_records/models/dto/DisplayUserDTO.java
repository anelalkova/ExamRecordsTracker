package mk.finki.ukim.mk.exam_records.models.dto;

import mk.finki.ukim.mk.exam_records.models.User;
import mk.finki.ukim.mk.exam_records.models.UserRole;

public record DisplayUserDTO(Long id, String email, String name, String surname, UserRole role) {
    public static DisplayUserDTO from(User user) {
        return new DisplayUserDTO(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getSurname(),
                user.getRole()
        );
    }
}
