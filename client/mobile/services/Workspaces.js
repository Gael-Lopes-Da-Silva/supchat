
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

export const createWorkspace = async (body) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}workspaces`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return await response.json();
};

export const getPublicWorkspaces = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}workspaces/public`, {
    method: "GET",
    headers,
  });
  return await response.json();
};

export const readWorkspace = async ({ id }) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}workspaces/${id}`, {
    method: "GET",
    headers,
  });
  return await response.json();
};

export const updateWorkspace = async (id, body) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}workspaces/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });
  return await response.json();
};

export const deleteWorkspace = async (id) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}workspaces/${id}`, {
    method: "DELETE",
    headers,
  });
  return await response.json();
};

export const restoreWorkspace = async (id) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}workspaces/${id}`, {
    method: "PATCH",
    headers,
  });
  return await response.json();
};
