package mk.finki.ukim.mk.exam_records.controllers;

import mk.finki.ukim.mk.exam_records.models.UserRole;
import mk.finki.ukim.mk.exam_records.service.application.impl.RoleApplicationServiceImpl;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {
    private final RoleApplicationServiceImpl roleApplicationService;

    public RoleController(RoleApplicationServiceImpl roleApplicationService) {
        this.roleApplicationService = roleApplicationService;
    }

    @GetMapping("/find-all")
    public List<UserRole> findAll() {
        return roleApplicationService.findAll();
    }
}
