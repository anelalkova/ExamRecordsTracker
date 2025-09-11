package mk.finki.ukim.mk.exam_records.models.dto;

import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mk.finki.ukim.mk.exam_records.models.StudentExam;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamRegistrationCsvDTO {
    
    @CsvBindByName(column = "Student Index")
    private String index;
    
    @CsvBindByName(column = "Name")
    private String name;
    
    @CsvBindByName(column = "Surname")
    private String surname;
    
    @CsvBindByName(column = "Email")
    private String email;
    
    @CsvBindByName(column = "Student Program")
    private String studentProgram;
    
    @CsvBindByName(column = "Registered")
    private String registered;
    
    @CsvBindByName(column = "Attended")
    private String attended;
    
    public static ExamRegistrationCsvDTO from(StudentExam studentExam) {
        return new ExamRegistrationCsvDTO(
                studentExam.getStudent().getIndex() != null ? studentExam.getStudent().getIndex().toString() : "",
                studentExam.getStudent().getName(),
                studentExam.getStudent().getSurname(),
                studentExam.getStudent().getEmail(),
                studentExam.getStudent().getStudentProgram() != null ? studentExam.getStudent().getStudentProgram().getName() : "",
                "Yes",
                studentExam.getShowed() ? "Yes" : "No"
        );
    }
}

