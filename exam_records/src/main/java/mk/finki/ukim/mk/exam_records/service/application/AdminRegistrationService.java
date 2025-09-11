package mk.finki.ukim.mk.exam_records.service.application;

import mk.finki.ukim.mk.exam_records.models.dto.DisplayUserDTO;
import mk.finki.ukim.mk.exam_records.models.dto.StudentCsvImportDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AdminRegistrationService {
    List<DisplayUserDTO> registerStudentsFromCsv(MultipartFile file);
    DisplayUserDTO registerSingleStudent(StudentCsvImportDTO studentData);
    void sendCredentialsEmail(String email);
}

