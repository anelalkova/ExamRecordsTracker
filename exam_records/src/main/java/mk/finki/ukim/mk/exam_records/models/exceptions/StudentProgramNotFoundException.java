package mk.finki.ukim.mk.exam_records.models.exceptions;

public class StudentProgramNotFoundException extends RuntimeException {
    public StudentProgramNotFoundException(Long studentProgramId) {
        super("Student program with id " + studentProgramId + " not found");
    }
}
