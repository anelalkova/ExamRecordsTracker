import axiosInstance from "../axios/axios.js";

const roleRepository = {
    findAll: async () => {
        return await axiosInstance.get("/roles/find-all");
    },
};

export default roleRepository;
