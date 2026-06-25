import api from "./api";

const TOKEN_KEY = "auth_token";
const TOKEN_TYPE_KEY = "auth_token_type";

function clearAuthStorage() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_TYPE_KEY);

  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_TYPE_KEY);
}

function saveAuth(token, tokenType, remember = true) {
  clearAuthStorage();

  const storage = remember ? localStorage : sessionStorage;

  storage.setItem(TOKEN_KEY, token);
  storage.setItem(TOKEN_TYPE_KEY, tokenType || "Bearer");
}

export async function login({ email, senha, remember = true }) {
  const response = await api.post("/auth/login", {
    email,
    senha,
  });

  const { token, tipo } = response.data;

  saveAuth(token, tipo, remember);

  return response.data;
}

export function logout() {
  clearAuthStorage();
}

export function getToken() {
  return (
    localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null
  );
}

export function getTokenType() {
  return (
    localStorage.getItem(TOKEN_TYPE_KEY) ||
    sessionStorage.getItem(TOKEN_TYPE_KEY) ||
    "Bearer"
  );
}

export function isAuthenticated() {
  return Boolean(getToken());
}