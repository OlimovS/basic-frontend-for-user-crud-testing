import axios from 'axios';

const service = axios.create({
  baseURL: 'http://localhost:3033',
});

export default service;
