package mk.finki.ukim.mk.exam_records.service.domain.impl;

import mk.finki.ukim.mk.exam_records.models.UserRole;
import mk.finki.ukim.mk.exam_records.repository.UserRoleRepository;
import mk.finki.ukim.mk.exam_records.service.domain.RoleDomainService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleDomainServiceImpl implements RoleDomainService {
    private final UserRoleRepository roleRepository;

    public RoleDomainServiceImpl(UserRoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public List<UserRole> findAll() {
        return roleRepository.findAll();
    }
}
