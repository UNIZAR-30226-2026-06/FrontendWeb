import { apiRequest } from "./apiClient";

const ROLE_DESCRIPTIONS = {
  espia: "Mira en secreto la mano de un jugador.",
  ladron: "Intercambia una carta tuya por una aleatoria de otro jugador.",
  "anular_cartas": "Descarta una carta de tu mano sin jugarla.",
  "transformar_carta": "Cambia el color o el número de una carta tuya.",
  "mirar_siguiente_carta": "Mira la próxima carta del mazo antes de robarla.",
  "bloquear_habilidades": "Bloquea los roles del resto de jugadores durante una ronda.",
};

const normalizeRoleKey = (name = "") => {
  const n = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  if (n === "espia") return "espia";
  if (n === "ladron") return "ladron";
  if (n === "anular cartas") return "anular_cartas";
  if (n === "transformar carta") return "transformar_carta";
  if (n === "mirar la siguiente carta del mazo") return "mirar_siguiente_carta";
  if (n === "bloquear habilidades") return "bloquear_habilidades";
  return null;
};

const normalizeRole = (data) => {
  if (!data) return null;

  const roleName = data.role?.nombre || "Rol";
  const key = normalizeRoleKey(roleName);
  const description = (key && ROLE_DESCRIPTIONS[key]) || data.role?.descripcion || "";

  return {
    gameId: data.gameId,
    playerId: data.playerId,
    uses: data.uses ?? 0,
    maxUses: data.role?.num_usos_max ?? data.maxUses ?? 3,
    lastUsedTurn: data.lastUsedTurn ?? null,
    canUseNow: data.canUseNow ?? false,

    role: {
      id: data.role?.id_rol ?? null,
      name: roleName,
      icon: data.role?.imagen || null,
      description,
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