import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { refresh } from '~/services/authServices';

const httpRequest = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: { 'Access-Control-Allow-Origin': '*' },
});

// Check exp of access token to generate new refresh token
httpRequest.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('accessToken');
        let currentDate = new Date();
        if (accessToken) {
            const decodedToken = jwtDecode(accessToken);
            if (decodedToken.exp * 1000 < currentDate.getTime()) {
                const res = await refresh();
                config.headers.Authorization = `Bearer1 ${res.accessToken}`;
            } else {
                config.headers.Authorization = `Bearer2 ${accessToken}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default httpRequest;