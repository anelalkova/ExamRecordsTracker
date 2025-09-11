import axiosInstance from "../axios/axios.js";

const userRepository = {
    register: async (data) => {
        return await axiosInstance.post("/users/register", data);
    },
    login: async (data) => {
        return await axiosInstance.post("/users/login", data);
    },
    findAll: async () => {
        return await axiosInstance.get("/users/find-all");
    },
    findByRole: async (role) => {
        return await axiosInstance.get(`/users/find-by-role/${role}`, role)
    },
    updateUserRole: async (userId, roleId) => {
        return await axiosInstance.put(`/users/${userId}/role?roleId=${roleId}`);
    }
};

export default userRepository;
