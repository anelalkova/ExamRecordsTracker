package mk.finki.ukim.mk.exam_records.controllers;

import mk.finki.ukim.mk.exam_records.models.dto.ChangePasswordDTO;
import mk.finki.ukim.mk.exam_records.models.dto.PasswordResetDTO;
import mk.finki.ukim.mk.exam_records.models.exceptions.InvalidArgumentsException;
import mk.finki.ukim.mk.exam_records.service.application.PasswordManagementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/password")
public class PasswordManagementController {
    
    private final PasswordManagementService passwordManagementService;
    
    public PasswordManagementController(PasswordManagementService passwordManagementService) {
        this.passwordManagementService = passwordManagementService;
    }
    
    @PostMapping("/change")
    public ResponseEntity<Void> changePassword(
            @RequestBody ChangePasswordDTO changePasswordDTO,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            passwordManagementService.changePassword(userEmail, changePasswordDTO);
            return ResponseEntity.ok().build();
        } catch (InvalidArgumentsException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/reset-request")
    public ResponseEntity<Void> requestPasswordReset(@RequestParam String email) {
        try {
            passwordManagementService.requestPasswordReset(email);
            return ResponseEntity.ok().build();
        } catch (InvalidArgumentsException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/reset")
    public ResponseEntity<Void> resetPassword(@RequestBody PasswordResetDTO passwordResetDTO) {
        try {
            passwordManagementService.resetPasswordWithToken(passwordResetDTO);
            return ResponseEntity.ok().build();
        } catch (InvalidArgumentsException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/validate-token")
    public ResponseEntity<Void> validateResetToken(@RequestParam String token) {
        boolean isValid = passwordManagementService.validateResetToken(token);
        return isValid ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }
}

