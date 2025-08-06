package mk.finki.ukim.mk.exam_records.service.application;

import mk.finki.ukim.mk.exam_records.models.UserRole;

import java.util.List;

public interface RoleApplicationService {
    List<UserRole> findAll();
}
