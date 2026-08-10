import axios from "axios";

const TOKEN_KEY = "auth_token";
const TOKEN_TYPE_KEY = "auth_token_type";
const USER_KEY = "auth_user";

function getStoredToken() {
  return (
    localStorage.getItem(TOKEN_KEY) ||
    sessionStorage.getItem(TOKEN_KEY) ||
    null
  );
}

function getStoredTokenType() {
  return (
    localStorage.getItem(TOKEN_TYPE_KEY) ||
    sessionStorage.getItem(TOKEN_TYPE_KEY) ||
    "Bearer"
  );
}

function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_TYPE_KEY);
  localStorage.removeItem(USER_KEY);

  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_TYPE_KEY);
  sessionStorage.removeItem(USER_KEY);
}

const API_BASE_URL = import.meta.env.PROD
  ? ""
  : (
      import.meta.env.VITE_API_URL?.trim() ||
      "http://localhost:8080"
    );

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    const tokenType = getStoredTokenType();

    if (token) {
      config.headers.Authorization = `${tokenType} ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";
    const isLoginRequest = requestUrl.includes("/auth/login");

    if (status === 401 && !isLoginRequest) {
      clearStoredAuth();

      if (!window.location.pathname.startsWith("/login")) {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;