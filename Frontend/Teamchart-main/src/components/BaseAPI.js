import axios from 'axios';

const api = axios.create({
  baseURL: 'https://teammanager-26h1.onrender.com', // your Spring Boot port
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;