import baseApi from './baseApi';

const authService = {
  login: async (email, password) => {
    try {
      const response = await baseApi.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
    register: async (data) => {
        try {
        const response = await baseApi.post('/auth/register', data);
        return response.data;
        } catch (error) {
        throw error;
        }
    },
};

export default authService;