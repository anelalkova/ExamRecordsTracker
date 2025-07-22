package mk.finki.ukim.mk.exam_records.service.application.impl;

import mk.finki.ukim.mk.exam_records.models.Subject;
import mk.finki.ukim.mk.exam_records.models.dto.CreateSubjectDTO;
import mk.finki.ukim.mk.exam_records.models.dto.DisplaySubjectDTO;
import mk.finki.ukim.mk.exam_records.service.application.SubjectApplicationService;
import mk.finki.ukim.mk.exam_records.service.domain.SubjectDomainService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SubjectApplicationServiceImpl implements SubjectApplicationService {
    private final SubjectDomainService subjectDomainService;

    public SubjectApplicationServiceImpl(SubjectDomainService subjectDomainService) {
        this.subjectDomainService = subjectDomainService;
    }

    @Override
    public Optional<DisplaySubjectDTO> findByCode(Long code) {
        return Optional.of(DisplaySubjectDTO.from(subjectDomainService.findByCode(code)));
    }

    @Override
    public Optional<DisplaySubjectDTO> save(CreateSubjectDTO createSubjectDto) {
        Subject subject = subjectDomainService.create(
                createSubjectDto.code(),
                createSubjectDto.name(),
                createSubjectDto.year(),
                createSubjectDto.semesterId(),
                createSubjectDto.staffIds()
        );
        return Optional.of(DisplaySubjectDTO.from(subject));
    }

    @Override
    public Optional<DisplaySubjectDTO> update(CreateSubjectDTO createSubjectDto) {
        Subject subject = subjectDomainService.update(
                createSubjectDto.code(),
                createSubjectDto.name(),
                createSubjectDto.year(),
                createSubjectDto.semesterId(),
                createSubjectDto.staffIds()
        );
        return Optional.of(DisplaySubjectDTO.from(subject));    }
}
