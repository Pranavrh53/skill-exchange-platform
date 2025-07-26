import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = `${API_BASE_URL}/api/portfolio`;

export const addPortfolioItem = (item, token) => axios.post(API_URL, item, { headers: { Authorization: `Bearer ${token}` } });
export const getPortfolioItems = (token) => axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
