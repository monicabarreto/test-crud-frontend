import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7168/api/products",
});

export default api;
