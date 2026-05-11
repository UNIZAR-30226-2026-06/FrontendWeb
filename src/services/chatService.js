import { apiRequest } from "./apiClient";

export const sendChatMessage = (partida_id, mensaje) => {
  return apiRequest("/chat/match", "POST", { partida_id, mensaje });
};

export const getChatHistory = (partida_id) => {
  return apiRequest(`/chat/history/${partida_id}`, "GET");
};