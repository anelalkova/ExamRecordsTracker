package mk.finki.ukim.mk.exam_records.service.domain;

import mk.finki.ukim.mk.exam_records.models.UserRole;

import java.util.List;

public interface RoleDomainService {
    List<UserRole> findAll();
}
