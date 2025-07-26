import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = `${API_BASE_URL}/api/matches`;

export const getMatches = (token) => axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
