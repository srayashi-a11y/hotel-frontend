import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api"
});

export const IMAGE_BASE_URL = import.meta.env.VITE_API_URL + "/uploads/users/";

export default API;