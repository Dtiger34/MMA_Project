import baseApi from './baseApi';

const productService = {
    getAll: async () => {
        try {
            const response = await baseApi.get('/products/getAll');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getProductById: async (id) => {
        try {
            const response = await baseApi.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    create: async (data) => {
        try {
            const response = await baseApi.post('/products/create', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    update: async (id, data) => {
        try {
            const response = await baseApi.put(`/products/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    delete: async (id) => {
        try {
            const response = await baseApi.delete(`/products/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default productService;