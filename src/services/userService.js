import { apiRequest } from "./apiClient";


export const getMyProfile = () => {
  return apiRequest("/usuarios/me", "GET");
};

export const updateBasicProfile = (nuevoCorreo) => {
  return apiRequest("/usuarios/me", "PUT", { correo: nuevoCorreo });
};

export const updateActiveAvatar = (avatarId) => {
  return apiRequest("/usuarios/me/avatar", "PUT", { avatar_id: avatarId });
};

export const updateActiveStyle = (estiloId) => {
  return apiRequest("/usuarios/me/estilo", "PUT", { estilo_id: estiloId });
};


export const getMyFriends = () => apiRequest("/friends", "GET");

export const searchUsers = (query) => apiRequest(`/friends/search/${query}`, "GET");

export const deleteFriend = (id) => apiRequest(`/friends/${id}`, "DELETE");

export const sendFriendRequest = (id) => apiRequest(`/friends/request/${id}`, "POST");

export const getPendingRequests = () => apiRequest("/friends/request/pending", "GET");

export const acceptFriendRequest = (userId) => {
  return apiRequest(`/friends/request/${userId}/accept`, "PUT");
};

export const rejectFriendRequest = (userId) => {
  return apiRequest(`/friends/request/${userId}/reject`, "PUT");
};