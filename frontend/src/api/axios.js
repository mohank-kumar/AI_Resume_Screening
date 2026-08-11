import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use((config) => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            const userId = user?.id || user?.data?.id;
            if (userId) {
                config.headers["X-User-ID"] = userId;
            }
        } catch (e) {
            console.error("Error parsing user from localStorage", e);
        }
    }
    return config;
});

export default api;