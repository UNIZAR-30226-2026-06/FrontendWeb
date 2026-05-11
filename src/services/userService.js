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

export const getMyBoughtAvatars = () => {
  return apiRequest("/usuarios/me/avatares", "GET");
};

export const getMyBoughtStyles = () => {
  return apiRequest("/usuarios/me/estilos", "GET");
};

export const getMyFriends = () => apiRequest("/friends", "GET");

export const searchUsers = (query) => apiRequest(`/friends/search/${query}`, "GET");

export const deleteFriend = (id) => apiRequest(`/friends/${id}`, "DELETE");

export const sendFriendRequest = (id) => apiRequest(`/friends/request/${id}`, "POST");

export const getPendingRequests = () => apiRequest("/friends/request/pending", "GET");

export const getFriendsCount = () => apiRequest("/friends/count", "GET");

export const getConnectedFriends = () => apiRequest("/friends/connected", "GET");

export const acceptFriendRequest = (userId) => {
  return apiRequest(`/friends/request/${userId}/accept`, "PUT");
};

export const rejectFriendRequest = (userId) => {
  return apiRequest(`/friends/request/${userId}/reject`, "PUT");
};


export const getStoreAvatars = () => {
  return apiRequest("/store/avatars", "GET");
};

export const getStoreEstilos = () => {
  return apiRequest("/store/estilos", "GET");
};

export const getAvatarById = (id) => apiRequest(`/store/avatars/${id}`, "GET");

export const getWalletBalance = () => {
  return apiRequest("/wallet/balance", "GET");
};

export const purchaseAvatar = (idAvatar) => {
  return apiRequest("/wallet/purchase/avatar", "POST", { id_avatar: idAvatar });
};

export const purchaseEstilo = (idEstilo) => {
  return apiRequest("/wallet/purchase/estilo", "POST", { id_estilo: idEstilo });
};