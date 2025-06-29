import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:2999', // your Spring Boot port
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;