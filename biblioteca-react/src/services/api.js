import axios from "axios";

const api = axios.create({
  baseURL: "https://dedde.pythonanywhere.com/api/",
});

export default api;