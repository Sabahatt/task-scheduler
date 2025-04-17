import axios from "axios";
import Api from "@/constants/Api";

const axiosClient = axios.create({
  baseURL: Api.API_URL,
  headers: {
    "Content-type": "application/json"
  }
});

export default axiosClient;