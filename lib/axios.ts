// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "/api",
//   withCredentials: true,
// });

// export default axiosInstance;
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export default axiosInstance;
