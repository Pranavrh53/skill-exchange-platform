import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = `${API_BASE_URL}/api/profile`;

export const getProfile = (token) => axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
export const updateProfile = (profileData, token) => axios.put(API_URL, profileData, { headers: { Authorization: `Bearer ${token}` } });
