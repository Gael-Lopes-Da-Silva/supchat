
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.apiUrl;

const getAuthHeaders = async () => {
  const userDataString = await AsyncStorage.getItem("user");
  const userData = JSON.parse(userDataString);
  const token = userData?.token;

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const createChannel = async ({ name, description, is_private, workspace_id, user_id }) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}channels`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name, description, is_private, workspace_id, user_id }),
  });

  if (!response.ok) throw new Error("Network response was not ok");

  return await response.json();
};

export const readChannel = async (query) => {
  const headers = await getAuthHeaders();
  const params = new URLSearchParams(query).toString();
  const response = await fetch(`${API_URL}channels?${params}`, {
    method: "GET",
    headers,
  });

  return await response.json();
};

export const updateChannel = async (id, body) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}channels/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });

  return await response.json();
};

export const deleteChannel = async (id) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}channels/${id}`, {
    method: "DELETE",
    headers,
  });

  return await response.json();
};

export const restoreChannel = async (id) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}channels/${id}`, {
    method: "PATCH",
    headers,
  });

  return await response.json();
};

export const checkUserAlreadyInChannel = async (channel_id, user_id) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}channels/members?channel_id=${channel_id}&user_id=${user_id}`, {
    method: "GET",
    headers,
  });

  return await response.json();
};

export const addUserToChannel = async ({ channel_id, user_id, role_id = 2, inviter_id }) => {
  const headers = await getAuthHeaders();
  try {
    const response = await fetch(`${API_URL}channels/members`, {
      method: "POST",
      headers,
      body: JSON.stringify({ channel_id, user_id, role_id, inviter_id }),
    });
    return await response.json();
  } catch (err) {
    console.error("Erreur addUserToChannel:", err);
    return { error: 1, error_message: "Erreur réseau ou serveur." };
  }
};

export const getChannelMembers = async (channel_id) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}channels/members?channel_id=${channel_id}`, {
    method: "GET",
    headers,
  });
  return await response.json();
};

export const uploadFile = async (formData) => {
  const headers = await getAuthHeaders();
  delete headers["Content-Type"];
  const response = await fetch(`${API_URL}channels/upload`, {
    method: "POST",
    headers,
    body: formData,
  });
  return await response.json();
};

export const getUserChannelIds = async (user_id, workspace_id) => {
  const headers = await getAuthHeaders();
  try {
    const response = await fetch(`${API_URL}channels/members?user_id=${user_id}&workspace_id=${workspace_id}`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    return data.result.map((member) => member.channel_id);
  } catch (err) {
    console.error("Erreur getUserChannelIds:", err);
    return [];
  }
};

export const getUsersReactions = async (message_id, emoji) => {
  const headers = await getAuthHeaders();
  try {
    const response = await fetch(`${API_URL}channels/getUsersReactions?message_id=${message_id}&emoji=${emoji}`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error_message);
    return data.users || [];
  } catch (error) {
    console.error("Erreur getUsersReactions:", error);
    return [];
  }
};
