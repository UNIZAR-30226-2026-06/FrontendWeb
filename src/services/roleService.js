import { apiRequest } from "./apiClient";

const normalizeRole = (data) => {
  if (!data) return null;

  return {
    gameId: data.gameId,
    playerId: data.playerId,
    uses: data.uses ?? 0,
    maxUses: data.role?.num_usos_max ?? data.maxUses ?? 3,
    lastUsedTurn: data.lastUsedTurn ?? null,
    canUseNow: data.canUseNow ?? false,

    role: {
      id: data.role?.id_rol ?? null,
      name: data.role?.nombre || "Rol",
      icon: data.role?.imagen || null,
      description: data.role?.descripcion || "",
    },
  };
};

export const getPlayerRole = (gameId) => {
  return apiRequest(`/roles/${gameId}/me`, "GET")
    .then(normalizeRole);
};

export const getRoleUses = (gameId) => {
  return apiRequest(`/roles/${gameId}/me/uses`, "GET");
};

export const useRole = (gameId, payload = {}) => {
  return apiRequest(`/roles/${gameId}/use`, "POST", payload);
};