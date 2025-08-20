import axiosInstance from "../axios/axios.js";

const examsRepository = {
    findAll: async () => {
        return await axiosInstance.get("/subjects/find-all");
    },
    findAllPaged: async (subjectCode, page = 0, size = 5) => {
        return await axiosInstance.get(`/exams/all-exams-for-subject/${subjectCode}?page=${page}&size=${size}`);
    },
};

export default examsRepository;
