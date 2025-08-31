import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = `${API_BASE_URL}/api/matching`;

/**
 * Get potential matches with optional filters
 * @param {string} token - Authentication token
 * @param {Object} filters - Optional filters {skill_id, location}
 * @returns {Promise} Axios promise
 */
export const getMatches = (token, filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.skill_id) params.append('skill_id', filters.skill_id);
  if (filters.location) params.append('location', filters.location);
  
  return axios.get(API_URL, { 
    params,
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    } 
  });
};

/**
 * Get all available skills for filtering
 * @param {string} token - Authentication token
 * @returns {Promise} Axios promise
 */
export const getAvailableSkills = (token) => {
  return axios.get(`${API_URL}/skills`, { 
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    } 
  });
};
