package mk.finki.ukim.mk.exam_records.service.application;

import mk.finki.ukim.mk.exam_records.models.dto.*;

import java.math.BigDecimal;
import java.util.List;

public interface TeacherApplicationService {
    
    DisplayExamDTO createExamAsTeacher(CreateExamDTO createExamDTO, Long teacherId);
    
    List<StudentExamResultDTO> getStudentsForGrading(Long examId, Long teacherId);
    
    StudentExamResultDTO assignGrade(Long examId, Long studentId, BigDecimal grade, Long teacherId);
    
    List<DisplayExamDTO> getExamsForTeacher(Long teacherId);
    
    boolean canTeacherAccessExam(Long examId, Long teacherId);
    
    boolean canTeacherAccessSubject(Long subjectCode, Long teacherId);
}
