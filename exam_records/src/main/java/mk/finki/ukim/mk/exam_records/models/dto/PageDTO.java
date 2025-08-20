package mk.finki.ukim.mk.exam_records.models.dto;

import java.util.List;

public record PageDTO<T>(
        List<T> content,
        long totalElements,
        int pageNumber,
        int pageSize,
        int totalPages
) {}