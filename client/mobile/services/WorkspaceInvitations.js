
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

export const createWorkspaceInvitation = async (body) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}workspaces/invitations`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  return await response.json();
};

export const joinWorkspaceWithInvitation = async (body) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}workspaces/invitations/join`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  return await response.json();
};

export const readWorkspaceInvitation = async (query) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}workspaces/invitations?${new URLSearchParams(query).toString()}`, {
    method: "GET",
    headers,
  });

  return await response.json();
};

export const updateWorkspaceInvitation = async (id, body) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}workspaces/invitations/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });

  return await response.json();
};

export const deleteWorkspaceInvitation = async (id) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}workspaces/invitations/${id}`, {
    method: "DELETE",
    headers,
  });

  return await response.json();
};

export const restoreWorkspaceInvitation = async (id) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}workspaces/invitations/${id}`, {
    method: "PATCH",
    headers,
  });

  return await response.json();
};
