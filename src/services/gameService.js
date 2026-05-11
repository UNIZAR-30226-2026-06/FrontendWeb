import { apiRequest } from "./apiClient";

export const createGame = (config) => {
  return apiRequest("/partidas", "POST", config);
};

export const joinGameById = () => {
  return apiRequest(`/partidas/join`, "POST");
};

export const joinGameByCode = (codigo) => {
  return apiRequest("/partidas/join-by-code", "POST", { codigo });
};

export const getGameInfo = (gameId) => {
  return apiRequest(`/partidas/${gameId}`, "GET");
};

export const getGameState = (gameId) => {
  return apiRequest(`/partidas/${gameId}/state`, "GET");
};

export const startGame = (gameId) => {
  return apiRequest(`/partidas/${gameId}/start`, "POST");
};

export const endGame = (gameId) => {
  return apiRequest(`/partidas/${gameId}/end`, "POST");
};

export const playCard = (gameId, cardId) => {
  return apiRequest(`/partidas/${gameId}/play-card`, "POST", { cardId });
};

export const drawCard = (gameId) => {
  return apiRequest(`/partidas/${gameId}/draw-card`, "POST");
};