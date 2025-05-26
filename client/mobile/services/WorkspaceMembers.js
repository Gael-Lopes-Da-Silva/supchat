
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

export const createWorkspaceMember = async (body) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}workspaces/members`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  return await response.json();
};

export const readWorkspaceMember = async (query) => {
  const headers = await getAuthHeaders();
  const url = query.id
    ? `${API_URL}workspaces/members/${query.id}`
    : `${API_URL}workspaces/members?${new URLSearchParams(query).toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  return await response.json();
};

export const updateWorkspaceMember = async (id, body) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}workspaces/members/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });

  return await response.json();
};

export const deleteWorkspaceMember = async (id) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}workspaces/members/${id}`, {
    method: "DELETE",
    headers,
  });

  return await response.json();
};

export const restoreWorkspaceMember = async (id) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}workspaces/members/${id}`, {
    method: "PATCH",
    headers,
  });

  return await response.json();
};
