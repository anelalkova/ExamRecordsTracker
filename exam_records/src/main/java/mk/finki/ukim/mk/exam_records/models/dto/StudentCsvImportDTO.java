package mk.finki.ukim.mk.exam_records.models.dto;

import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentCsvImportDTO {
    
    @CsvBindByName(column = "Name")
    private String name;
    
    @CsvBindByName(column = "Surname")
    private String surname;
    
    @CsvBindByName(column = "Email")
    private String email;
    
    @CsvBindByName(column = "Index")
    private String index;
    
    @CsvBindByName(column = "Student Program")
    private String studentProgram;
    
    public Long getIndexAsLong() {
        try {
            return index != null && !index.trim().isEmpty() ? Long.parseLong(index.trim()) : null;
        } catch (NumberFormatException e) {
            return null;
        }
    }
}

