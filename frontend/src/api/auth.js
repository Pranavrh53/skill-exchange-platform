import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = `${API_BASE_URL}/api/auth`;

export const signup = (userData) => axios.post(`${API_URL}/signup`, userData);
export const login = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.userId) {
            localStorage.setItem('userId', response.data.userId);
        }
    }
    return response;
};
