import baseApi from './baseApi';

const userService = {
    getAll: async () => {
        try {
            const response = await baseApi.get('/users/admin/getAll');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getUserById: async (userId) => {
        try {
            const response = await baseApi.get(`/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateUser: async (userId, data) => {
        try {
            const response = await baseApi.put(`/users/${userId}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteUser: async (userId) => {
        try {
            const response = await baseApi.delete(`/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default userService;