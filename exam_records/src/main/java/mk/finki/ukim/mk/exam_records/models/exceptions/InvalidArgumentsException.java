package mk.finki.ukim.mk.exam_records.models.exceptions;

public class InvalidArgumentsException extends RuntimeException {
    public InvalidArgumentsException() {
        super("Invalid data");
    }
}
