package mk.finki.ukim.mk.exam_records.models.exceptions;

public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String message) {
        super("An account with email " + message + " already exists");
    }
}
