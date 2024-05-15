import axios from "axios";
const instance = axios.create({
  baseURL: process.env.URL_BACKEND,
  withCredentials: true,
});
export default instance;
