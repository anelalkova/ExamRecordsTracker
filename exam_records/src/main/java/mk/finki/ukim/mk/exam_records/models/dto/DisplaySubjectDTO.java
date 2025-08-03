package mk.finki.ukim.mk.exam_records.models.dto;

import mk.finki.ukim.mk.exam_records.models.Subject;
import mk.finki.ukim.mk.exam_records.models.enumeration.Semester;

import java.util.List;

public record DisplaySubjectDTO(Long code,
                                String name,
                                Integer year,
                                Semester semester,
                                List<DisplayUserDTO> subjectStaff) {
    public static DisplaySubjectDTO from(Subject subject) {
        return new DisplaySubjectDTO(
                subject.getCode(),
                subject.getName(),
                subject.getYear(),
                subject.getSemester(),
                subject.getStaff().stream().map(DisplayUserDTO::from).toList()
        );
    }
}
