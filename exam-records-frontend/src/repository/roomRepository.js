import axiosInstance from '../axios/axios.js';

const roomRepository = {
    findAll: async () => {
        return await axiosInstance.get('/rooms');
    },
    
    findById: async (id) => {
        return await axiosInstance.get(`/rooms/${id}`);
    },
    
    create: async (roomData) => {
        return await axiosInstance.post('/rooms/create', roomData);
    },
    
    update: async (id, roomData) => {
        return await axiosInstance.post(`/rooms/update/${id}`, roomData);
    }
};

export default roomRepository;
