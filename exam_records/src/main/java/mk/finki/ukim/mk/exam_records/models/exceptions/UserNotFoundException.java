package mk.finki.ukim.mk.exam_records.models.exceptions;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String email) {
        String.format("An account with email %s does not exist!", email);
    }
}
