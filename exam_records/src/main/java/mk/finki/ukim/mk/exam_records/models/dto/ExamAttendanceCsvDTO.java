package mk.finki.ukim.mk.exam_records.models.dto;

import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamAttendanceCsvDTO {
    
    @CsvBindByName(column = "Student Index")
    private String index;
    
    @CsvBindByName(column = "Email")
    private String email;
    
    @CsvBindByName(column = "Attended")
    private String attended;
    
    public boolean isAttended() {
        return "Yes".equalsIgnoreCase(attended) || "true".equalsIgnoreCase(attended) || "1".equals(attended);
    }
}

