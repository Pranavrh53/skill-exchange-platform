import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = `${API_BASE_URL}/api/users`;

const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});

export const getAllUsers = (token) => {
  return axios.get(API_URL, {
    headers: getAuthHeaders(token)
  });
};

export const getUserById = (userId, token) => {
  return axios.get(`${API_URL}/${userId}`, {
    headers: getAuthHeaders(token)
  });
};
