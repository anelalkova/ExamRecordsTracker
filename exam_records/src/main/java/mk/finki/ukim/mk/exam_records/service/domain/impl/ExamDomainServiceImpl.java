package mk.finki.ukim.mk.exam_records.service.domain.impl;

import jakarta.transaction.Transactional;
import mk.finki.ukim.mk.exam_records.models.*;
import mk.finki.ukim.mk.exam_records.repository.ExamRepository;
import mk.finki.ukim.mk.exam_records.repository.SessionRepository;
import mk.finki.ukim.mk.exam_records.repository.StudentExamRepository;
import mk.finki.ukim.mk.exam_records.service.domain.ExamDomainService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;

@Service
public class ExamDomainServiceImpl implements ExamDomainService {

    private final ExamRepository examRepository;
    private final SubjectDomainServiceImpl subjectDomainService;
    private final SessionRepository sessionRepository;
    private final UserDomainServiceImpl userDomainService;
    private final RoomDomainServiceImpl roomDomainService;
    private final StudentExamRepository studentExamRepository;

    public ExamDomainServiceImpl(ExamRepository examRepository,
                                 SubjectDomainServiceImpl subjectDomainService,
                                 SessionRepository sessionRepository,
                                 UserDomainServiceImpl userDomainService,
                                 RoomDomainServiceImpl roomDomainService, StudentExamRepository studentExamRepository) {
        this.examRepository = examRepository;
        this.subjectDomainService = subjectDomainService;
        this.sessionRepository = sessionRepository;
        this.userDomainService = userDomainService;
        this.roomDomainService = roomDomainService;
        this.studentExamRepository = studentExamRepository;
    }

    @Override
    public Exam create(Long subjectCode, Long sessionId, LocalDate dateOfExam, LocalTime startTime, LocalTime endTime) {
        Subject subject = subjectDomainService.findByCode(subjectCode);
        Session session = sessionRepository.findById(sessionId).orElseThrow(() -> new IllegalArgumentException("Session not found"));

        Exam exam = new Exam(subject, session, dateOfExam, startTime, endTime);
        return examRepository.save(exam);
    }

    @Override
    public List<Exam> findAll() {
        return examRepository.findAll();
    }

    @Transactional
    @Override
    public Exam register(Long examId, Long studentId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new IllegalArgumentException("Exam not found"));

        User student = userDomainService.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!student.isStudent()) {
            throw new IllegalArgumentException("User is not a student");
        }

        boolean alreadyRegistered = exam.getStudentExams().stream()
                .anyMatch(se -> se.getStudent().getId().equals(studentId));
        if (alreadyRegistered) {
            throw new IllegalArgumentException("Student is already registered for this exam");
        }

        ensureCapacityOrReserveRoom(exam, exam.getStudentExams().size() + 1);

        StudentExam studentExam = new StudentExam();
        studentExam.setExam(exam);
        studentExam.setStudent(student);
        exam.getStudentExams().add(studentExam);

        return examRepository.save(exam);
    }

    @Transactional
    @Override
    public void attendExam(Long examId, Long studentId) {
        StudentExam studentExam = studentExamRepository
                .findByExamIdAndStudentId(examId, studentId)
                .orElseThrow(() -> new IllegalArgumentException("The student didn't register for the exam"));

        studentExam.setShowed(true);
        studentExamRepository.save(studentExam);
    }

    @Override
    public Page<Exam> findAllForSubject(Long subjectCode, Pageable pageable) {
        return examRepository.findAllForSubject(subjectCode, pageable);
    }

    private void ensureCapacityOrReserveRoom(Exam exam, int expectedStudents) {
        int totalCapacity = exam.getRooms().stream()
                .mapToInt(Room::getCapacity)
                .sum();

        if (expectedStudents <= totalCapacity) {
            return;
        }

        int neededSeats = expectedStudents - totalCapacity;

        List<Room> availableRooms = roomDomainService.findAvailableRooms(
                exam.getId(),
                exam.getDateOfExam(),
                exam.getStartTime(),
                exam.getEndTime()
        );

        availableRooms.sort(Comparator.comparingInt(Room::getCapacity).reversed());

        for (Room room : availableRooms) {
            exam.getRooms().add(room);
            neededSeats -= room.getCapacity();
            if (neededSeats <= 0) break;
        }

        if (neededSeats > 0) {
            throw new IllegalStateException("Not enough rooms available to accommodate all students");
        }
    }
}
