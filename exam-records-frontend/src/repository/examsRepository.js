import axiosInstance from "../axios/axios.js";

const examsRepository = {
    findAll: async () => {
        return await axiosInstance.get("/exams/find-all");
    },
    findAllPaged: async (subjectCode, page = 0, size = 5) => {
        return await axiosInstance.get(`/exams/all-exams-for-subject/${subjectCode}?page=${page}&size=${size}`);
    },
    findAllPagedForStudent: async (subjectCode, studentId, page = 0, size = 5) => {
        return await axiosInstance.get(`/exams/all-exams-for-subject/${subjectCode}/student/${studentId}?page=${page}&size=${size}`);
    },
    create: async (data) => {
        return await axiosInstance.post("/exams/create", data);
    },
    register: async (examId, studentId) => {
        return await axiosInstance.post(`/exams/register-for-exam/${examId}?studentId=${studentId}`);
    },
    markAttendance: async (examId, studentId) => {
        return await axiosInstance.put(`/exams/${examId}/students/${studentId}/attendance`);
    },
    unmarkAttendance: async (examId, studentId) => {
        return await axiosInstance.delete(`/exams/${examId}/students/${studentId}/attendance`);
    },
};

export default examsRepository;
