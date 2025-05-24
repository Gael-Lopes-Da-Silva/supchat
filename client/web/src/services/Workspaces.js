const getAuthHeaders = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const token = userData?.Token;

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const createWorkspace = async (body) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  return await response.json();
};

export const getPublicWorkspaces = async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/public`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return await response.json();
};

export const readWorkspace = async ({ id }) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return await response.json();
};

export const updateWorkspace = async (id, body) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  return await response.json();
};

export const deleteWorkspace = async (id) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return await response.json();
};

export const restoreWorkspace = async (id) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  return await response.json();
};
