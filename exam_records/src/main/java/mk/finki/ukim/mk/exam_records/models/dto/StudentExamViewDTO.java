package mk.finki.ukim.mk.exam_records.models.dto;

import mk.finki.ukim.mk.exam_records.models.Exam;
import mk.finki.ukim.mk.exam_records.models.Session;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;
import java.util.stream.Collectors;

public record StudentExamViewDTO(Long id,
                                 DisplaySubjectDTO subject,
                                 Session session,
                                 LocalDate dateOfExam,
                                 LocalTime startTime,
                                 LocalTime endTime,
                                 Set<DisplayRoomDTO> rooms,
                                 boolean isRegistered,
                                 boolean hasAttended) {
    
    public static StudentExamViewDTO from(Exam exam, boolean isRegistered, boolean hasAttended) {
        return new StudentExamViewDTO(
                exam.getId(),
                DisplaySubjectDTO.from(exam.getSubject()),
                exam.getSession(),
                exam.getDateOfExam(),
                exam.getStartTime(),
                exam.getEndTime(),
                exam.getRooms().stream()
                        .map(DisplayRoomDTO::from)
                        .collect(Collectors.toSet()),
                isRegistered,
                hasAttended
        );
    }
}
