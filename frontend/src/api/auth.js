import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = `${API_BASE_URL}/api/auth`;

export const signup = (userData) => axios.post(`${API_URL}/signup`, userData);
export const login = (credentials) => axios.post(`${API_URL}/login`, credentials);
