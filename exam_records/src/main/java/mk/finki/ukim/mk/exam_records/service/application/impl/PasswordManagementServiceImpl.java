package mk.finki.ukim.mk.exam_records.service.application.impl;

import mk.finki.ukim.mk.exam_records.models.User;
import mk.finki.ukim.mk.exam_records.models.dto.ChangePasswordDTO;
import mk.finki.ukim.mk.exam_records.models.dto.PasswordResetDTO;
import mk.finki.ukim.mk.exam_records.models.exceptions.InvalidArgumentsException;
import mk.finki.ukim.mk.exam_records.repository.UserRepository;
import mk.finki.ukim.mk.exam_records.service.application.PasswordManagementService;
import mk.finki.ukim.mk.exam_records.service.email.EmailService;
import mk.finki.ukim.mk.exam_records.service.utils.PasswordService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class PasswordManagementServiceImpl implements PasswordManagementService {
    
    private final UserRepository userRepository;
    private final PasswordService passwordService;
    private final EmailService emailService;
    
    public PasswordManagementServiceImpl(UserRepository userRepository,
                                       PasswordService passwordService,
                                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.emailService = emailService;
    }
    
    @Override
    public void changePassword(String userEmail, ChangePasswordDTO changePasswordDTO) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new InvalidArgumentsException("User not found"));
        
        if (!user.requiresPasswordChange() && 
            !passwordService.matches(changePasswordDTO.getCurrentPassword(), user.getPassword())) {
            throw new InvalidArgumentsException("Current password is incorrect");
        }
        
        if (!changePasswordDTO.isPasswordsMatch()) {
            throw new InvalidArgumentsException("New passwords do not match");
        }
        
        if (!passwordService.isValidPassword(changePasswordDTO.getNewPassword())) {
            throw new InvalidArgumentsException(
                "Password must be at least 8 characters long and contain uppercase, lowercase, digit, and special character"
            );
        }
        
        String encodedPassword = passwordService.encodePassword(changePasswordDTO.getNewPassword());
        user.setPassword(encodedPassword);
        
        if (user.requiresPasswordChange()) {
            user.markFirstLoginComplete();
        }
        
        user.clearPasswordResetToken();
        
        userRepository.save(user);
    }
    
    @Override
    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidArgumentsException("User not found"));
        
        String resetToken = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusHours(24);
        
        user.setPasswordResetToken(resetToken, expiry);
        userRepository.save(user);
        
        emailService.sendPasswordResetToken(
                user.getEmail(),
                user.getName() + " " + user.getSurname(),
                resetToken
        );
    }
    
    @Override
    public void resetPasswordWithToken(PasswordResetDTO passwordResetDTO) {
        User user = userRepository.findAll().stream()
                .filter(u -> passwordResetDTO.getToken().equals(u.getPasswordResetToken()))
                .findFirst()
                .orElseThrow(() -> new InvalidArgumentsException("Invalid reset token"));
        
        if (!user.isPasswordResetTokenValid()) {
            throw new InvalidArgumentsException("Reset token has expired");
        }
        
        if (!passwordResetDTO.isPasswordsMatch()) {
            throw new InvalidArgumentsException("New passwords do not match");
        }
        
        if (!passwordService.isValidPassword(passwordResetDTO.getNewPassword())) {
            throw new InvalidArgumentsException(
                "Password must be at least 8 characters long and contain uppercase, lowercase, digit, and special character"
            );
        }
        
        String encodedPassword = passwordService.encodePassword(passwordResetDTO.getNewPassword());
        user.setPassword(encodedPassword);
        
        user.clearPasswordResetToken();
        
        if (user.requiresPasswordChange()) {
            user.markFirstLoginComplete();
        }
        
        userRepository.save(user);
    }
    
    @Override
    public boolean validateResetToken(String token) {
        return userRepository.findAll().stream()
                .anyMatch(user -> token.equals(user.getPasswordResetToken()) && user.isPasswordResetTokenValid());
    }
}

