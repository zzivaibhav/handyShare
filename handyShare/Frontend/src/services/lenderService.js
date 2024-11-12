import axios from 'axios';
import { SERVER_URL } from '../constants.js';

const getLenderDetails = async (lenderId, token) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/v1/user/lender/${lenderId}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch lender details.';
  }
};

export default {
  getLenderDetails,
};
