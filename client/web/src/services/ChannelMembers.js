
const getAuthHeaders = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const token = userData?.token;

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};



export const createChannelMember = async (body) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}channels/members`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
    });

    return await response.json();
};

export const readChannelMember = async ({ channel_id }) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}channels/members?channel_id=${channel_id}`,
    {
      method: "GET",
      headers: getAuthHeaders(), 
    }
  );
  return await response.json();
};

export const updateChannelMember = async (id, body) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}channels/members/` + id, {
        method: "PUT",
        headers: getAuthHeaders(), 
        body: JSON.stringify(body),
    });

    return await response.json();
};

export const deleteChannelMember = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}channels/members/` + id, {
        method: "DELETE",
        headers: getAuthHeaders(), 
    });

    return await response.json();
};

export const restoreChannelMember = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}channels/members/` + id, {
        method: "PATCH",
        headers: getAuthHeaders(), 
    });

    return await response.json();
};