package mk.finki.ukim.mk.exam_records.service.csv;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.bean.StatefulBeanToCsvBuilder;
import com.opencsv.exceptions.CsvDataTypeMismatchException;
import com.opencsv.exceptions.CsvRequiredFieldEmptyException;
import mk.finki.ukim.mk.exam_records.models.dto.*;
import mk.finki.ukim.mk.exam_records.models.exceptions.CsvProcessingException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class CsvService {
    
    public <T> byte[] exportToCsv(List<T> data, Class<T> clazz) {
        try (StringWriter writer = new StringWriter()) {
            StatefulBeanToCsv<T> beanToCsv = new StatefulBeanToCsvBuilder<T>(writer).build();
            beanToCsv.write(data);
            return writer.toString().getBytes(StandardCharsets.UTF_8);
        } catch (IOException | CsvDataTypeMismatchException | CsvRequiredFieldEmptyException e) {
            throw new CsvProcessingException("Error exporting data to CSV", e);
        }
    }
    
    public <T> List<T> importFromCsv(MultipartFile file, Class<T> clazz) {
        try (Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8)) {
            CsvToBean<T> csvToBean = new CsvToBeanBuilder<T>(reader)
                    .withType(clazz)
                    .withIgnoreLeadingWhiteSpace(true)
                    .withIgnoreEmptyLine(true)
                    .build();
            return csvToBean.parse();
        } catch (IOException e) {
            throw new CsvProcessingException("Error importing data from CSV", e);
        }
    }
    
    public <T> List<T> importFromCsv(String csvContent, Class<T> clazz) {
        try (Reader reader = new StringReader(csvContent)) {
            CsvToBean<T> csvToBean = new CsvToBeanBuilder<T>(reader)
                    .withType(clazz)
                    .withIgnoreLeadingWhiteSpace(true)
                    .withIgnoreEmptyLine(true)
                    .build();
            return csvToBean.parse();
        } catch (Exception e) {
            throw new CsvProcessingException("Error importing data from CSV", e);
        }
    }
    
    public byte[] exportUsersToCsv(List<UserCsvDTO> users) {
        return exportToCsv(users, UserCsvDTO.class);
    }
    
    
    public byte[] exportStudentsToCsv(List<StudentSubjectCsvDTO> students) {
        return exportToCsv(students, StudentSubjectCsvDTO.class);
    }
    
    public List<StudentSubjectCsvDTO> importStudentsFromCsv(MultipartFile file) {
        return importFromCsv(file, StudentSubjectCsvDTO.class);
    }
    
    public byte[] exportExamRegistrationsToCsv(List<ExamRegistrationCsvDTO> registrations) {
        return exportToCsv(registrations, ExamRegistrationCsvDTO.class);
    }
    
    public List<ExamAttendanceCsvDTO> importExamAttendanceFromCsv(MultipartFile file) {
        return importFromCsv(file, ExamAttendanceCsvDTO.class);
    }
}

