package mk.finki.ukim.mk.exam_records.service.domain.impl;

import mk.finki.ukim.mk.exam_records.models.Exam;
import mk.finki.ukim.mk.exam_records.models.Session;
import mk.finki.ukim.mk.exam_records.models.Subject;
import mk.finki.ukim.mk.exam_records.repository.ExamRepository;
import mk.finki.ukim.mk.exam_records.repository.SessionRepository;
import mk.finki.ukim.mk.exam_records.service.domain.ExamDomainService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class ExamDomainServiceImpl implements ExamDomainService {

    private final ExamRepository examRepository;
    private final SubjectDomainServiceImpl subjectDomainService;
    private final SessionRepository sessionRepository;

    public ExamDomainServiceImpl(ExamRepository examRepository, SubjectDomainServiceImpl subjectDomainService, SessionRepository sessionRepository) {
        this.examRepository = examRepository;
        this.subjectDomainService = subjectDomainService;
        this.sessionRepository = sessionRepository;
    }

    @Override
    public Exam create(Long subjectCode, Long sessionId, LocalDate dateOfExam, LocalTime startTime, LocalTime endTime) {
        Exam exam = new Exam();
        Subject subject = subjectDomainService.findByCode(subjectCode);
        if(subject != null){
            exam.setSubject(subject);
        }
        Session session = sessionRepository.findById(sessionId).orElse(null);
        if(session != null){
            exam.setSession(session);
        }
        exam.setDateOfExam(dateOfExam);
        exam.setStartTime(startTime);
        exam.setEndTime(endTime);
        return examRepository.save(exam);
    }

    @Override
    public List<Exam> findAll() {
        return examRepository.findAll();
    }
}
