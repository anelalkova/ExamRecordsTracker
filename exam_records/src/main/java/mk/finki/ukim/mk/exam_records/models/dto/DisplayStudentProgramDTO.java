package mk.finki.ukim.mk.exam_records.models.dto;

import mk.finki.ukim.mk.exam_records.models.StudentProgram;

public record DisplayStudentProgramDTO(
        Long id,
        String name,
        int year
) {
    public static DisplayStudentProgramDTO from(StudentProgram studentProgram) {
        return new DisplayStudentProgramDTO(
                studentProgram.getId(),
                studentProgram.getName(),
                studentProgram.getYear()
        );
    }
}
