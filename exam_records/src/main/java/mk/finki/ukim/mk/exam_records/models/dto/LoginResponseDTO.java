package mk.finki.ukim.mk.exam_records.models.dto;

public record LoginResponseDTO(
        String token,
        boolean requiresPasswordChange,
        String userRole,
        String userEmail
) {
}
