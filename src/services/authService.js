import { apiRequest } from "./apiClient";

export const registerUser = (nombre_usuario, correo, password) => {
  return apiRequest("/auth/register", "POST", { nombre_usuario, correo, password });
};

export const loginUser = (nombre_usuario, password) => {
  return apiRequest("/auth/login", "POST", { nombre_usuario, password });
};

export const getCheckMe = () => {
  return apiRequest("/auth/me", "GET");
};

export const logoutUser = () => {
  return apiRequest("/auth/logout", "POST");
};