import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = `${API_BASE_URL}/api/profile`;

export const getProfile = (userId, token) =>
  axios.get(API_URL, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    params: {
      user_id: userId
    }
  });

export const updateProfile = (userId, profileData, token) => {
  // Transform skills arrays to match backend expectations
  const transformedData = {
    ...profileData,
    user_id: userId,
    offered_skills: profileData.offered_skills || [],
    required_skills: profileData.required_skills || []
  };

  return axios.put(API_URL, transformedData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
};
