import axiosInstance from "../axios/axios.js";

const subjectRepository = {
    findAll: async () => {
        return await axiosInstance.get("/subjects/find-all");
    },
    findAllPaged: async (page = 0, size = 5) => {
        return await axiosInstance.get(`/subjects/find-all-paged?page=${page}&size=${size}`);
    },
    add: async (data) => {
        return await axiosInstance.post("/subjects/create", data);
    },
    update: async (code, data) => {
        return await axiosInstance.post(`/subjects/update/${code}`, data);
    },
    findAllForUserPaged: async (userEmail, page = 0, size = 5) => {
        return await axiosInstance.get(`/subjects/find-all-for-student/${userEmail}?page=${page}&size=${size}`);
    },
    findAllForTeacherPaged: async (userEmail, page = 0, size = 5) => {
        return await axiosInstance.get(`/subjects/find-all-for-teacher/${userEmail}?page=${page}&size=${size}`);
    },
    findById: async(code) => {
        return await axiosInstance.get(`/subjects/find-by-code/${code}`);
    }
};

export default subjectRepository;
