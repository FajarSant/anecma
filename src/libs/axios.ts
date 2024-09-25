import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://anecma-backup.pembelajaranmu.id/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;