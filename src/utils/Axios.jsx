import axios from "axios";

const baseURL = "https://grocery-backend-9jjx.onrender.com/api";
// const baseURL = "http://localhost:4001/api"; // Local development
const Axios = axios.create({
  baseURL,
  withCredentials: true, // send cookies
});

Axios.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // 👉 Skip refresh logic if the failing endpoint is /me
    const isMeRoute = originalRequest.url?.includes("/me");

    if (err.response?.status === 401 && !originalRequest._retry && !isMeRoute) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${baseURL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );

        return Axios(originalRequest); // Retry the original request
      } catch (refreshErr) {
        console.error("❌ Refresh token failed. Redirecting to login.");

        localStorage.removeItem("user");
        sessionStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default Axios;
