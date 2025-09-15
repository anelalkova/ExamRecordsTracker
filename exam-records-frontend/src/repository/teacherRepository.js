import axiosInstance from '../axios/axios.js';

const teacherRepository = {
    createExam: async (examData, teacherId) => {
        return await axiosInstance.post(`/teacher/exams/create?teacherId=${teacherId}`, examData);
    },

    getTeacherExams: async (teacherId) => {
        return await axiosInstance.get(`/teacher/exams?teacherId=${teacherId}`);
    },

    getStudentsForGrading: async (examId, teacherId) => {
        return await axiosInstance.get(`/teacher/exams/${examId}/students?teacherId=${teacherId}`);
    },

    assignGrade: async (examId, studentId, grade, teacherId) => {
        return await axiosInstance.put(`/teacher/exams/${examId}/students/${studentId}/grade?grade=${grade}&teacherId=${teacherId}`);
    },

    assignGradeByDTO: async (gradeAssignment, teacherId) => {
        return await axiosInstance.post(`/teacher/grades/assign?teacherId=${teacherId}`, gradeAssignment);
    },

    canAccessSubject: async (subjectCode, teacherId) => {
        return await axiosInstance.get(`/teacher/subjects/${subjectCode}/access?teacherId=${teacherId}`);
    },

    canAccessExam: async (examId, teacherId) => {
        return await axiosInstance.get(`/teacher/exams/${examId}/access?teacherId=${teacherId}`);
    }
};

export default teacherRepository;
