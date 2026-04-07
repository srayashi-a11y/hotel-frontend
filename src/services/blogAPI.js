import axios from "axios";

const blogAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
});

export const IMAGE_BASE_URL =
  import.meta.env.VITE_API_URL + "/uploads/blogs/";

export default blogAPI;