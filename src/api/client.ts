import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Replace with your local machine's IP address (e.g., http://192.168.1.5:5002/api)
// Localhost won't work on physical mobile devices.
const BASE_URL = 'http://192.168.1.5:5002/api'; 

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
