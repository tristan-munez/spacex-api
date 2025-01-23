import axios from 'axios';

// Create an Axios instance with the SpaceX API base URL
const apiClient = axios.create({
  baseURL: 'https://api.spacexdata.com/v3/launches',
  timeout: 1000000, //To show loading
});

export const fetchLaunches = async (offset = 0) => {
    try {
      const response = await apiClient.get('/', { params: { limit: 5, offset } });
      return response.data;
    } catch (error) {
      console.error('Error fetching launches:', error);
      throw error;
    }
};