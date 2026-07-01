import api from "./api";

const TOKEN_KEY = "auth_token";
const TOKEN_TYPE_KEY = "auth_token_type";
const USER_KEY = "auth_user";

function clearAuthStorage() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_TYPE_KEY);
  localStorage.removeItem(USER_KEY);

  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_TYPE_KEY);
  sessionStorage.removeItem(USER_KEY);
}

function getTargetStorage(remember = true) {
  return remember ? localStorage : sessionStorage;
}

function saveToken(token, tokenType, remember = true) {
  const storage = getTargetStorage(remember);

  storage.setItem(TOKEN_KEY, token);
  storage.setItem(TOKEN_TYPE_KEY, tokenType || "Bearer");
}

function saveUser(user, remember = true) {
  const storage = getTargetStorage(remember);
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export async function login({ email, senha, remember = true }) {
  clearAuthStorage();

  const loginResponse = await api.post("/auth/login", {
    email,
    senha,
  });

  const { token, tipo } = loginResponse.data;

  saveToken(token, tipo, remember);

  try {
    const userResponse = await api.get("/api/usuarios/me");
    saveUser(userResponse.data, remember);

    return {
      token,
      tipo,
      usuario: userResponse.data,
    };
  } catch (error) {
    clearAuthStorage();
    throw error;
  }
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

export function getCurrentUser() {
  const rawUser =
    localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getToken());
}