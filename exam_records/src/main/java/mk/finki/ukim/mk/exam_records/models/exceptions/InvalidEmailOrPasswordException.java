package mk.finki.ukim.mk.exam_records.models.exceptions;

public class InvalidEmailOrPasswordException extends RuntimeException {
  public InvalidEmailOrPasswordException(String message) {
    super(message);
  }
}
