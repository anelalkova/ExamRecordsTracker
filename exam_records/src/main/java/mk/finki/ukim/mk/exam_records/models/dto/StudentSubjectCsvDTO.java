package mk.finki.ukim.mk.exam_records.models.dto;

import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mk.finki.ukim.mk.exam_records.models.User;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentSubjectCsvDTO {
    
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
    
    public static StudentSubjectCsvDTO from(User student) {
        return new StudentSubjectCsvDTO(
                student.getIndex() != null ? student.getIndex().toString() : "",
                student.getName(),
                student.getSurname(),
                student.getEmail(),
                student.getStudentProgram() != null ? student.getStudentProgram().getName() : ""
        );
    }
}

