const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

export const apiRequest = async (endpoint, method = "GET", body = null) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }
  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (err) {
    throw new Error("Respuesta no es JSON válido");
  }

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
    }
    throw new Error(data?.error || data?.message || "Error en la conexión");
  }

  return data;
};