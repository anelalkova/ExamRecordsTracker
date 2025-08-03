package mk.finki.ukim.mk.exam_records.service.domain.impl;

import mk.finki.ukim.mk.exam_records.models.Subject;
import mk.finki.ukim.mk.exam_records.models.User;
import mk.finki.ukim.mk.exam_records.models.enumeration.Semester;
import mk.finki.ukim.mk.exam_records.repository.SubjectRepository;
import mk.finki.ukim.mk.exam_records.service.domain.SubjectDomainService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SubjectDomainServiceImpl implements SubjectDomainService {

    private final SubjectRepository subjectRepository;
    private final UserDomainServiceImpl userDomainService;

    public SubjectDomainServiceImpl(SubjectRepository subjectRepository, UserDomainServiceImpl userDomainService) {
        this.subjectRepository = subjectRepository;
        this.userDomainService = userDomainService;
    }

    @Override
    public Subject findByCode(Long code) {
        return subjectRepository.findByCode(code);
    }

    @Override
    public Subject create(Long code, String name, Integer year, Semester semester, List<Long> staffIds) {
        if (subjectRepository.existsById(code)) {
            throw new IllegalArgumentException("Subject with code " + code + " already exists.");
        }

        Subject subject = new Subject();
        subject.setCode(code);
        subject.setName(name);
        subject.setYear(year);
        subject.setSemester(semester);

        List<User> staff = staffIds.stream()
                .map(userDomainService::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .filter(user -> {
                    String role = user.getRole().getRole();
                    return "ROLE_ASSISTANT".equals(role) || "ROLE_PROFESSOR".equals(role);
                })
                .collect(Collectors.toCollection(ArrayList::new));

        subject.setStaff(staff);

        return subjectRepository.save(subject);
    }

    @Override
    public Subject update(Long code, String name, Integer year, Semester semester, List<Long> staffIds) {
        Subject subject = subjectRepository.findById(code)
                .orElseThrow(() -> new IllegalArgumentException("Subject with code " + code + " not found"));

        subject.setName(name);
        subject.setYear(year);
        subject.setSemester(semester);

        List<User> staff = staffIds.stream()
                .map(userDomainService::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .filter(user -> {
                    String role = user.getRole().getRole();
                    return "ROLE_TEACHER".equals(role);
                })
                .collect(Collectors.toCollection(ArrayList::new));

        subject.setStaff(staff);

        return subjectRepository.save(subject);
    }
}
