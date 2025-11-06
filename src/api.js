import axios from "axios";

export const API = axios.create({
  baseURL: "https://ai-doc-ser.vercel.app/api", // backend URL
  withCredentials: true, // JWT cookie
});
