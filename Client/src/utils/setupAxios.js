import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
// Only rewrite in production when API base is provided
if (API_BASE) {
  axios.interceptors.request.use((config) => {
    if (typeof config.url === "string") {
      // Replace local dev base with your API base URL
      config.url = config.url.replace(/^http:\/\/localhost:5000\b/, API_BASE);
    }
    return config;
  });
}