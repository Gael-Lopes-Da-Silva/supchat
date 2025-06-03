import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.apiUrl;

export const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return await response.json();
  } catch (error) {
    return { error: true, message: "Erreur serveur" };
  }
};

export const readUser = async (query, api_url = API_URL) => {
  let url = "";
  if (query.id) {
    url = `${api_url}users/${query.id}`;
  } else if (query.confirm_token) {
    url = `${api_url}users?confirm_token=${query.confirm_token}`;
  } else {
    return { error: true, message: "Paramètre requis manquant." };
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const updateUser = async (userId, updatedData, api_url = API_URL) => {
  if (!userId) return { error: true, message: "ID utilisateur manquant" };
  const url = `${api_url}users/${userId}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    return { error: true, message: "Erreur serveur" };
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${API_URL}users/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    return { error: true, message: "Erreur serveur" };
  }
};

export const restoreUser = async (id) => {
  try {
    const response = await fetch(`${API_URL}users/${id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    return { error: true, message: "Erreur serveur" };
  }
};

export const loginUser = async (body) => {
  try {
    const response = await fetch(`${API_URL}users/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    return await response.json();
  } catch (error) {
    return { error: true, message: "Erreur serveur" };
  }
};

export const getUserProviders = async (userId) => {
  try {
    const response = await fetch(`${API_URL}users/${userId}/providers`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      return {
        error: true,
        message: `Erreur récupération des providers: ${response.statusText}`,
      };
    }
    return await response.json();
  } catch (error) {
    return { error: true, message: "Erreur serveur" };
  }
};

export const linkProvider = async (userId, provider, providerId) => {
  try {
    const response = await fetch(`${API_URL}users/link-provider`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        provider,
        provider_id: providerId,
      }),
    });
    if (!response.ok) {
      return {
        error: true,
        message: `Erreur lors de la liaison du provider: ${response.statusText}`,
      };
    }
    return await response.json();
  } catch (error) {
    return { error: true, message: "Erreur serveur" };
  }
};

export const readUserByEmail = async (email, api_url = API_URL) => {
  if (!email) {
    return { error: true, message: "Email requis" };
  }

  const url = `${api_url}users/by-email/${email}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      return { error: true, message: `Erreur HTTP ${response.status}` };
    }
    return await response.json();
  } catch (error) {
    return { error: true, message: "Erreur serveur" };
  }
};
