package mk.finki.ukim.mk.exam_records.controllers;

import mk.finki.ukim.mk.exam_records.models.dto.CreateUserDTO;
import mk.finki.ukim.mk.exam_records.models.dto.DisplayUserDTO;
import mk.finki.ukim.mk.exam_records.models.dto.DisplayStudentDTO;
import mk.finki.ukim.mk.exam_records.models.dto.LoginResponseDTO;
import mk.finki.ukim.mk.exam_records.models.dto.LoginUserDTO;
import mk.finki.ukim.mk.exam_records.models.exceptions.InvalidArgumentsException;
import mk.finki.ukim.mk.exam_records.models.exceptions.InvalidUserCredentialsException;
import mk.finki.ukim.mk.exam_records.models.exceptions.PasswordsDoNotMatchException;
import mk.finki.ukim.mk.exam_records.service.application.UserApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserApplicationService userApplicationService;

    public UserController(UserApplicationService userApplicationService) {
        this.userApplicationService = userApplicationService;
    }


    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginUserDTO loginUserDto) {
        try {
            return userApplicationService.login(loginUserDto)
                    .map(ResponseEntity::ok)
                    .orElseThrow(InvalidUserCredentialsException::new);
        } catch (InvalidUserCredentialsException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/find-all")
    public List<DisplayUserDTO> findAll() {
        return userApplicationService.findAll();
    }

    @GetMapping("/find-by-role/{role}")
    public List<DisplayUserDTO> findByRole(@PathVariable String role) {
        return userApplicationService.findAllByRole(role);
    }

    @GetMapping("/find-all-students")
    public List<DisplayStudentDTO> findAllStudents() {
        return userApplicationService.findAllStudents();
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<DisplayUserDTO> updateUserRole(@PathVariable Long id, @RequestParam Long roleId) {
        try {
            DisplayUserDTO updatedUser = userApplicationService.updateUserRole(id, roleId);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
