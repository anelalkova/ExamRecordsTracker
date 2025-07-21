package mk.finki.ukim.mk.exam_records.models.exceptions;

public class InvalidUserCredentialsException extends RuntimeException {
    public InvalidUserCredentialsException() {
        String.format("Invalid credentials");
    }
}
