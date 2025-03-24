import baseApi from './baseApi';

const categoryService = {
    getAll: async () => {
        try {
            const response = await baseApi.get('/categories/getAll');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    create: async (data) => {
        try {
            const response = await baseApi.post('/categories/create', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default categoryService;