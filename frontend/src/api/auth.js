import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = `${API_BASE_URL}/api/auth`;

export const signup = (userData) => axios.post(`${API_URL}/signup`, userData);
export const login = async (credentials) => {
    console.log('Sending login request to:', `${API_URL}/login`);
    const response = await axios.post(`${API_URL}/login`, credentials);
    console.log('Login response:', response.data);
    
    if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('Token stored in localStorage');
        
        if (response.data.userId) {
            localStorage.setItem('userId', response.data.userId);
            console.log('User ID stored in localStorage:', response.data.userId);
        } else if (response.data.user && response.data.user.id) {
            // Handle case where user ID is nested in a user object
            localStorage.setItem('userId', response.data.user.id);
            console.log('User ID (nested) stored in localStorage:', response.data.user.id);
        } else {
            console.warn('No user ID found in login response');
        }
    } else {
        console.warn('No token found in login response');
    }
    
    return response;
};
