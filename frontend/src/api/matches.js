import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getPotentialMatches = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/matches`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};

export const initiateBarter = async (token, matchData) => {
  try {
    const response = await axios.post(
      `${API_URL}/barter-sessions`,
      matchData,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error initiating barter:', error);
    throw error;
  }
};
