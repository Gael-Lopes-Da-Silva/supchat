const getAuthHeaders = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const token = userData?.token;

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};


export const createWorkspaceInvitation = async (body) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/invitations`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
    });

    return await response.json();
};

export const joinWorkspaceWithInvitation = async (body) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/invitations/join`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
    });

    return await response.json();
};


export const readWorkspaceInvitation = async (query) => {
     const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/invitations?` + new URLSearchParams(query), {
        method: "GET",
        headers: getAuthHeaders(),
    });

    return await response.json();
};

export const updateWorkspaceInvitation = async (id, body) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/invitations/` + id, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
    });

    return await response.json();
};

export const deleteWorkspaceInvitation = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/invitations/` + id, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    return await response.json();
};

export const restoreWorkspaceInvitation = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/invitations/` + id, {
        method: "PATCH",
        headers: getAuthHeaders(),
    });

    return await response.json();
};