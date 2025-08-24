// frontend/src/api/profile.js
import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = `${API_BASE_URL}/api/profile/`;

const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});

export const getProfile = (token) => {
  return axios.get(API_URL, {
    headers: getAuthHeaders(token)
  });
};

export const updateProfile = (profileData, token) => {
  return axios.put(API_URL, profileData, {
    headers: getAuthHeaders(token)
  });
};

export const checkProfileStatus = (token) => {
  return axios.get(`${API_URL}status`, {
    headers: getAuthHeaders(token)
  });
};

export const getUserProfile = (userId, token) => {
  return axios.get(`${API_BASE_URL}/api/users/${userId}`, {
    headers: getAuthHeaders(token)
  });
};
