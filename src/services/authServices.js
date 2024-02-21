import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import httpRequest from '~/utils/httpRequest';

// Sign in function
export const signIn = async (data = {}) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/sign-in`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// Forgot password function
export const forgotPassword = async (data = {}) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// Reset password function
export const resetPassword = async (data = {}) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/reset-password`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// Get current user function
export const getCurrUser = async () => {
    try {
        const res = await httpRequest.get('/auth/current-user');
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

// Refresh token function
export const refresh = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
        const decodedToken = jwtDecode(refreshToken);
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/refresh/${decodedToken._id}`, {
            token: refreshToken
        });
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        return res.data;
    } catch (err) {
        console.log(err);
    }
};

// Sign out function
export const signOut = async (data = {}) => {
    try {
        const res = await httpRequest.post('/auth/sign-out', data);
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
