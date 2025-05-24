const getAuthHeaders = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const token = userData?.Token;

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const createWorkspaceMember = async (body) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}workspaces/members`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    }
  );

  return await response.json();
};

export const readWorkspaceMember = async (query) => {
  const response = query.id
    ? await fetch(
        `${process.env.REACT_APP_API_URL}workspaces/members/` + query.id,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      )
    : await fetch(
        `${process.env.REACT_APP_API_URL}workspaces/members?` +
          new URLSearchParams(query),
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

  return await response.json();
};
export const updateWorkspaceMember = async (id, body) => {

  const response = await fetch(
    `${process.env.REACT_APP_API_URL}workspaces/members/${id}`,
    {
      method: "PUT",
     headers: getAuthHeaders(),
      body: JSON.stringify(body),
    }
  );

  return await response.json();
};

export const deleteWorkspaceMember = async (id) => {
 

  const response = await fetch(
    `${process.env.REACT_APP_API_URL}workspaces/members/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  return await response.json();
};

export const restoreWorkspaceMember = async (id) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}workspaces/members/` + id,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    }
  );

  return await response.json();
};
