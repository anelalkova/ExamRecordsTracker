package mk.finki.ukim.mk.exam_records.models.dto;

import mk.finki.ukim.mk.exam_records.models.User;

public record DisplayStudentDTO(
        Long id,
        String name,
        String surname,
        String index,
        String studentProgram
) {
    public static DisplayStudentDTO from(User user) {
        return new DisplayStudentDTO(
                user.getId(),
                user.getName(),
                user.getSurname(),
                user.getIndex() != null ? user.getIndex().toString() : null,
                user.getStudentProgram() != null ? user.getStudentProgram().getName() : null
        );
    }
}
