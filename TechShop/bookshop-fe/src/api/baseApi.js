import axios from "axios";
import apiConfig from "../../config.js";

const axiosClient = axios.create({
  baseURL: apiConfig.baseURL,
  headers: apiConfig.headers,
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response !== undefined && response.data !== undefined) {
      // Get all response
      return response;
    }
    return response;
  },
  async (error) => {
    // // Refresh token is expired

    // Unauthorized
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized error:", error);
      throw new Error("Either email address or password is incorrect. Please try again");
    }

    // Handle other errors
    throw error;
  }
);

export const get = (url, params = {}) => {
  return axiosClient.get(url, { params });
};

export default axiosClient;