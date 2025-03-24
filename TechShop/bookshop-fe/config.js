
const IP = "10.33.53.46";

const shopAppApi = `http://${IP}:9999`;

const apiConfig = {
    baseURL: shopAppApi,
    headers: {
        "Content-Type": "application/json",
    },
};

export default apiConfig;