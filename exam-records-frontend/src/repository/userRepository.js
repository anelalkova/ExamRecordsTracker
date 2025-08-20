import axiosInstance from "../axios/axios.js";

const userRepository = {
    register: async (data) => {
        return await axiosInstance.post("/users/register", data);
    },
    login: async (data) => {
        return await axiosInstance.post("/users/login", data);
    },
    findByRole: async (role) => {
        return await axiosInstance.get(`/users/find-by-role/${role}`, role)
    }
};

export default userRepository;
