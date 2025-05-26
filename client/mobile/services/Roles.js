
import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.apiUrl;

export const readRole = async (query) => {
  const params = new URLSearchParams(query).toString();
  const response = await fetch(`${API_URL}roles?${params}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return await response.json();
};

export const getRoles = async () => {
  const response = await fetch(`${API_URL}roles`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return await response.json();
};
