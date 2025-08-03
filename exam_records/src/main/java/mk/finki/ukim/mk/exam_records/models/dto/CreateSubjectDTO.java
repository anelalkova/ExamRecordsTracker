package mk.finki.ukim.mk.exam_records.models.dto;

import mk.finki.ukim.mk.exam_records.models.enumeration.Semester;

import java.util.List;

public record CreateSubjectDTO(
        Long code,
        String name,
        Integer year,
        Semester semester,
        List<Long> staffIds
) {}
