import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = `${API_BASE_URL}/api/chat`;

export const sendMessage = (message, token) => axios.post(`${API_URL}/send`, message, { headers: { Authorization: `Bearer ${token}` } });
export const getMessages = (sessionId, token) => axios.get(`${API_URL}/${sessionId}`, { headers: { Authorization: `Bearer ${token}` } });
