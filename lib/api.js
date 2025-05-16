import axios from 'axios';
console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
