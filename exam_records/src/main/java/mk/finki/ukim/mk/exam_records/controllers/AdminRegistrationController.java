package mk.finki.ukim.mk.exam_records.controllers;

import mk.finki.ukim.mk.exam_records.models.dto.CreateUserDTO;
import mk.finki.ukim.mk.exam_records.models.dto.DisplayUserDTO;
import mk.finki.ukim.mk.exam_records.models.dto.StudentCsvImportDTO;
import mk.finki.ukim.mk.exam_records.models.dto.UserCsvDTO;
import mk.finki.ukim.mk.exam_records.models.exceptions.InvalidArgumentsException;
import mk.finki.ukim.mk.exam_records.service.application.AdminRegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/registration")
@PreAuthorize("hasRole('ADMIN')")
public class AdminRegistrationController {
    
    private final AdminRegistrationService adminRegistrationService;
    
    public AdminRegistrationController(AdminRegistrationService adminRegistrationService) {
        this.adminRegistrationService = adminRegistrationService;
    }
    
    @PostMapping("/students/csv")
    public ResponseEntity<List<DisplayUserDTO>> registerStudentsFromCsv(
            @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            List<DisplayUserDTO> registeredStudents = adminRegistrationService.registerStudentsFromCsv(file);
            return ResponseEntity.ok(registeredStudents);
        } catch (InvalidArgumentsException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/students/single")
    public ResponseEntity<DisplayUserDTO> registerSingleStudent(
            @RequestBody StudentCsvImportDTO studentData) {
        try {
            DisplayUserDTO registeredStudent = adminRegistrationService.registerSingleStudent(studentData);
            return ResponseEntity.ok(registeredStudent);
        } catch (InvalidArgumentsException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/students/{email}/resend-credentials")
    public ResponseEntity<Void> resendCredentials(@PathVariable String email) {
        try {
            adminRegistrationService.sendCredentialsEmail(email);
            return ResponseEntity.ok().build();
        } catch (InvalidArgumentsException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PostMapping("/create-user")
    public ResponseEntity<DisplayUserDTO> createUser(@RequestBody UserCsvDTO createUserDTO) {
        try {
            DisplayUserDTO user = adminRegistrationService.registerUser(createUserDTO);
            return ResponseEntity.ok(user);
        } catch (InvalidArgumentsException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

}

