
import axios from 'axios';
import { handlerefreshtoken } from '../services/user';

const API_URL = import.meta.env.VITE_APP_API_URl;

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});


axiosInstance.interceptors.request.use(
    (config) => {


        if (config.data instanceof FormData) {

            config.headers['Content-Type'] = 'multipart/form-data';
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};





axiosInstance.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await handlerefreshtoken();
                isRefreshing = false;
                processQueue(null);
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                processQueue(refreshError);
                // if (window.location.pathname !== '/') {
                //     window.location.href = '/';
                // }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;