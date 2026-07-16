import api from "./api";

const TOKEN_KEY = "auth_token";
const TOKEN_TYPE_KEY = "auth_token_type";
const USER_KEY = "auth_user";

export const AUTH_USER_UPDATED_EVENT = "auth-user-updated";

function buildAbsoluteUrl(path) {
  if (!path) {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const baseUrl = (api.defaults.baseURL || "").replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

function addCacheBuster(url) {
  if (!url) {
    return "";
  }

  const separator = url.includes("?") ? "&" : "?";

  return `${url}${separator}v=${Date.now()}`;
}

export function normalizeUser(user, options = {}) {
  if (!user) {
    return null;
  }

  const { cacheBust = false } = options;

  const absoluteFotoUrl = buildAbsoluteUrl(user.fotoUrl);

  return {
    ...user,
    fotoUrl:
      cacheBust && absoluteFotoUrl
        ? addCacheBuster(absoluteFotoUrl)
        : absoluteFotoUrl,
  };
}

function dispatchUserUpdated(user) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(AUTH_USER_UPDATED_EVENT, {
      detail: user,
    })
  );
}

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

function getActiveStorage() {
  if (localStorage.getItem(TOKEN_KEY)) {
    return localStorage;
  }

  if (sessionStorage.getItem(TOKEN_KEY)) {
    return sessionStorage;
  }

  return localStorage;
}

function saveToken(token, tokenType, remember = true) {
  const storage = getTargetStorage(remember);

  storage.setItem(TOKEN_KEY, token);
  storage.setItem(TOKEN_TYPE_KEY, tokenType || "Bearer");
}

function saveUser(user, remember = true) {
  const storage = getTargetStorage(remember);
  const normalizedUser = normalizeUser(user);

  storage.setItem(USER_KEY, JSON.stringify(normalizedUser));

  return normalizedUser;
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
    const normalizedUser = saveUser(userResponse.data, remember);

    dispatchUserUpdated(normalizedUser);

    return {
      token,
      tipo,
      usuario: normalizedUser,
    };
  } catch (error) {
    clearAuthStorage();
    throw error;
  }
}

export function logout() {
  clearAuthStorage();
  dispatchUserUpdated(null);
}

export function getToken() {
  return (
    localStorage.getItem(TOKEN_KEY) ||
    sessionStorage.getItem(TOKEN_KEY) ||
    null
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

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

export function updateStoredUser(user) {
  const storage = getActiveStorage();
  const normalizedUser = normalizeUser(user);

  storage.setItem(USER_KEY, JSON.stringify(normalizedUser));

  if (storage === localStorage) {
    sessionStorage.removeItem(USER_KEY);
  } else {
    localStorage.removeItem(USER_KEY);
  }

  dispatchUserUpdated(normalizedUser);

  return normalizedUser;
}

export function isAuthenticated() {
  return Boolean(getToken());
}