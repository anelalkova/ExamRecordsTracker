package mk.finki.ukim.mk.exam_records.models.dto;

import mk.finki.ukim.mk.exam_records.models.StudentProgram;

public record CreateStudentProgramDTO(
        String name,
        int year
) {
    public StudentProgram toStudentProgram() {
        StudentProgram studentProgram = new StudentProgram();
        studentProgram.setName(name);
        studentProgram.setYear(year);
        return studentProgram;
    }
}
