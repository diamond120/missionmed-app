import axios from "axios";
import { BASE_URL } from "../config/app-config";
import { getToken } from '~/common/common';

const http = axios.create({
    //baseURL: process.env.API_URL,
    baseURL: BASE_URL,
    headers: {
        "Content-type": "application/json",
    },
});
http.interceptors.request.use((config) => {
    const token = getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
http.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.code === "ERR_NETWORK") {
            // TODO: handle internal server error
        } else if (error.response?.status === 401) {
            // handle unauthorized request
            localStorage.clear();
            window.location.href = "/sign_in";
        }
        return Promise.reject(error);
    }
);

export default http;
