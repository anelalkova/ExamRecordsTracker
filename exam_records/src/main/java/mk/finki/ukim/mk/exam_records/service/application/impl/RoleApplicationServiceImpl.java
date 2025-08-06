package mk.finki.ukim.mk.exam_records.service.application.impl;

import mk.finki.ukim.mk.exam_records.models.UserRole;
import mk.finki.ukim.mk.exam_records.service.application.RoleApplicationService;
import mk.finki.ukim.mk.exam_records.service.domain.impl.RoleDomainServiceImpl;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleApplicationServiceImpl implements RoleApplicationService {
    private final RoleDomainServiceImpl roleDomainService;

    public RoleApplicationServiceImpl(RoleDomainServiceImpl roleDomainService) {
        this.roleDomainService = roleDomainService;
    }

    @Override
    public List<UserRole> findAll() {
        return roleDomainService.findAll();
    }
}
