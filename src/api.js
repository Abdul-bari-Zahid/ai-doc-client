import axios from "axios";

export const API = axios.create({
  baseURL: "https://ai-doc-ser.vercel.app/api", // backend URL
  withCredentials: true, // JWT cookie
});

// Request Interceptor to add token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
