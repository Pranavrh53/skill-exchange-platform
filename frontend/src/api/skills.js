import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getSkills = async () => {
  try {
    const response = await axios.get(`${API_URL}/skills`);
    return response.data;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};

export const getUsersBySkill = async (skillId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/skills/${skillId}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching users for skill ${skillId}:`, error);
    throw error;
  }
};

export const createBarterSession = async (barterData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/barter-sessions`,
      barterData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating barter session:', error);
    throw error;
  }
};
