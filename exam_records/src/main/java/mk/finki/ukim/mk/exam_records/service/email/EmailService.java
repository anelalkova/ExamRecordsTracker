package mk.finki.ukim.mk.exam_records.service.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
public class EmailService {
    
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    
    @Value("${app.mail.from}")
    private String fromEmail;
    
    @Value("${app.frontend.url}")
    private String frontendUrl;
    
    public EmailService(JavaMailSender mailSender, SpringTemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }
    
    public void sendStudentCredentials(String toEmail, String studentName, String temporaryPassword) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Your Exam Records System Account - Action Required");
            
            String emailContent = createStudentCredentialsEmail(studentName, toEmail, temporaryPassword);
            helper.setText(emailContent, true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email to: " + toEmail, e);
        }
    }
    
    private String createStudentCredentialsEmail(String studentName, String email, String temporaryPassword) {
        String loginUrl = this.frontendUrl + "/login";
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #667eea; color: white; padding: 20px; }
                    .content { background: #f8f9fa; padding: 20px; }
                    .credentials { background: white; padding: 15px; margin: 15px 0; }
                    .button { background: #667eea; color: white; padding: 10px 20px; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Exam Records System</h1>
                    </div>
                    <div class="content">
                        <h2>Hello %s,</h2>
                        <p>Your student account has been created. Here are your login credentials:</p>
                        
                        <div class="credentials">
                            <p><strong>Email:</strong> %s</p>
                            <p><strong>Temporary Password:</strong> %s</p>
                        </div>
                        
                        <p><strong>Important:</strong> You must change your password on first login.</p>
                        
                        <a href="%s" class="button">Login to Your Account</a>
                        
                        <p>If you have questions, contact your administrator.</p>
                    </div>
                </div>
            </body>
            </html>
            """, studentName, email, temporaryPassword, loginUrl);
    }
    
    public void sendPasswordResetToken(String toEmail, String studentName, String resetToken) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Password Reset Request - Exam Records System");
            
            String emailContent = createPasswordResetEmail(studentName, resetToken);
            helper.setText(emailContent, true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send password reset email to: " + toEmail, e);
        }
    }
    
    private String createPasswordResetEmail(String studentName, String resetToken) {
        String resetUrl = this.frontendUrl + "/reset-password?token=" + resetToken;
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #ff6b6b; color: white; padding: 20px; }
                    .content { background: #f8f9fa; padding: 20px; }
                    .button { background: #ff6b6b; color: white; padding: 10px 20px; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Reset Request</h1>
                    </div>
                    <div class="content">
                        <h2>Hello %s,</h2>
                        <p>You requested a password reset for your Exam Records System account.</p>
                        
                        <a href="%s" class="button">Reset Your Password</a>
                        
                        <p><strong>Security Notice:</strong> This link will expire in 24 hours.</p>
                        <p>If you didn't request this reset, please ignore this email.</p>
                    </div>
                </div>
            </body>
            </html>
            """, studentName, resetUrl);
    }
}

