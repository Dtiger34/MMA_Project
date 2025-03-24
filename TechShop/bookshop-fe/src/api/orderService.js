import baseApi from './baseApi';

const orderService = {
    createOrder: async (orderData) => {
        try {
            const response = await baseApi.post('/orders/create', orderData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getAllOrdersByUserId: async (userId) => {
        try {
            const response = await baseApi.get(`/orders/getAllByUserId/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default orderService;