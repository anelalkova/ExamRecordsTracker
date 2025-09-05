import axiosInstance from "../axios/axios.js";

const studentProgramsRepository = {
    findAll: async () => {
        return await axiosInstance.get("/student-programs/find-all");
    }
};
export default studentProgramsRepository;