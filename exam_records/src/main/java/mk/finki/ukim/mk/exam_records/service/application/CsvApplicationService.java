package mk.finki.ukim.mk.exam_records.service.application;

import mk.finki.ukim.mk.exam_records.models.dto.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CsvApplicationService {
    
    byte[] exportUsersToCsv();
    byte[] exportUsersByRoleToCsv(String role);
    
    byte[] exportStudentsForSubjectToCsv(Long subjectCode);
    List<DisplayUserDTO> importStudentsForSubjectFromCsv(Long subjectCode, MultipartFile file);
    
    byte[] exportExamRegistrationsToCsv(Long examId);
    void importExamAttendanceFromCsv(Long examId, MultipartFile file);
    
    byte[] exportNotAttendedStudentsToCsv(Long examId);
}

