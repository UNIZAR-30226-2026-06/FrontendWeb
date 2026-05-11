import { apiRequest } from "./apiClient";

export const createGame = (config) => {
  return apiRequest("/partidas", "POST", config);
};

export const joinGameById = ({ mode, maxJugadores } = {}) => {
  const body = {};
  if (mode) body.mode = mode;
  if (maxJugadores) body.maxJugadores = maxJugadores;
  return apiRequest(`/partidas/join`, "POST", Object.keys(body).length ? body : null);
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

export const playCard = (gameId, cardId, options = {}) => {
  const body = { cardId };
  if (options.chosenColor) body.chosenColor = options.chosenColor;
  if (options.cancelColor) body.cancelColor = options.cancelColor;
  return apiRequest(`/partidas/${gameId}/play-card`, "POST", body);
};

export const drawCard = (gameId) => {
  return apiRequest(`/partidas/${gameId}/draw-card`, "POST");
};

export const requestPause = (gameId) => {
  return apiRequest(`/partidas/${gameId}/pause`, "POST");
};

export const resumeGame = (gameId) => {
  return apiRequest(`/partidas/${gameId}/resume`, "POST");
};

export const addBot = (gameId) => {
  return apiRequest(`/partidas/${gameId}/add-bot`, "POST");
};

export const getPausedGames = () => {
  return apiRequest(`/partidas/pausadas`, "GET");
};