package mk.finki.ukim.mk.exam_records.models.dto;

import java.util.List;

public record CreateSubjectDTO(
        Long code,
        String name,
        Integer year,
        Long semesterId,
        List<Long> staffIds
) {}
