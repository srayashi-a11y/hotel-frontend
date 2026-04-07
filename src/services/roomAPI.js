import axios from "axios";

const roomAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
});

roomAPI.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

/* UPDATED IMAGE URL */
export const IMAGE_BASE_URL =
  import.meta.env.VITE_API_URL + "/uploads/rooms/";

export default roomAPI;