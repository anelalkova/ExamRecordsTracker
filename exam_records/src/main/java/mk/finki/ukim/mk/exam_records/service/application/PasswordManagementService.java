package mk.finki.ukim.mk.exam_records.service.application;

import mk.finki.ukim.mk.exam_records.models.dto.ChangePasswordDTO;
import mk.finki.ukim.mk.exam_records.models.dto.PasswordResetDTO;

public interface PasswordManagementService {
    void changePassword(String userEmail, ChangePasswordDTO changePasswordDTO);
    void requestPasswordReset(String email);
    void resetPasswordWithToken(PasswordResetDTO passwordResetDTO);
    boolean validateResetToken(String token);
}

