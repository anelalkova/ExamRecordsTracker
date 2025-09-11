package mk.finki.ukim.mk.exam_records.models.dto;

import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mk.finki.ukim.mk.exam_records.models.User;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCsvDTO {
    
    @CsvBindByName(column = "Name")
    private String name;
    
    @CsvBindByName(column = "Surname")
    private String surname;
    
    @CsvBindByName(column = "Email")
    private String email;
    
    @CsvBindByName(column = "Role")
    private String role;
    
    @CsvBindByName(column = "Index")
    private String index;
    
    @CsvBindByName(column = "Student Program")
    private String studentProgram;
    
    public static UserCsvDTO from(User user) {
        return new UserCsvDTO(
                user.getName(),
                user.getSurname(),
                user.getEmail(),
                user.getRole().getRole(),
                user.getIndex() != null ? user.getIndex().toString() : "",
                user.getStudentProgram() != null ? user.getStudentProgram().getName() : ""
        );
    }
}

