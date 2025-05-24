
const getAuthHeaders = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const token = userData?.Token;

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};





export const createChannel = async ({ name, description, is_private, workspace_id, user_id }) => {

    const response = await fetch(`${process.env.REACT_APP_API_URL}channels`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            name,
            description,
            is_private,
            workspace_id,
            user_id,
        }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return await response.json();
};




export const readChannel = async (query) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}channels?${new URLSearchParams(query)}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return await response.json();
};




export const updateChannel = async (id, body) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}channels/` + id, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
    });

    return await response.json();
};

export const deleteChannel = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}channels/` + id, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    return await response.json();
};

export const restoreChannel = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}channels/` + id, {
        method: "PATCH",
        headers: getAuthHeaders(),
    });

    return await response.json();
};

export const checkUserAlreadyInChannel = async (channel_id, user_id) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}channels/members?channel_id=${channel_id}&user_id=${user_id}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return await response.json();
};

  

export const addUserToChannel = async ({ channel_id, user_id, role_id = 2,inviter_id }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}channels/members`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          channel_id,
          user_id,
          role_id,
          inviter_id
        }),
      });
  
      return await response.json();
    } catch (err) {
      console.error("Erreur addUserToChannel:", err);
      return { error: 1, error_message: "Erreur réseau ou serveur." };
    }
  };
  

  export const getChannelMembers = async (channel_id) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}channels/members?channel_id=${channel_id}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return await response.json();
};


export const uploadFile = async (formData) => {
  try {
    const headers = getAuthHeaders();
    delete headers["Content-Type"]; // faut enlever content type du header pour le multipart formdata

    const response = await fetch(`${process.env.REACT_APP_API_URL}channels/upload`, {
      method: "POST",
      headers, // faut juste envoyer le token 
      body: formData,
    });

    return await response.json();
  } catch (err) {
    console.error("Erreur uploadChannelFile:", err);
    return { error: 1, error_message: "Erreur réseau ou serveur." };
  }
};

  export const getUserChannelIds = async (user_id, workspace_id) => {
    try {
        const response = await fetch(
            `${process.env.REACT_APP_API_URL}channels/members?user_id=${user_id}&workspace_id=${workspace_id}`,
            {
                method: "GET",
                headers: getAuthHeaders(),
            }
        );

        const data = await response.json();

        return data.result.map(member => member.channel_id);
    } catch (err) {
        console.error("Erreur getUserChannelIds:", err);
        return [];
    }
};


export const getUsersReactions = async (message_id, emoji) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}channels/getUsersReactions?` + new URLSearchParams({
      message_id,
      emoji
    }), {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Erreur réseau");
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error_message);
    }

    return data.users || [];
  } catch (error) {
    console.error("Erreur getUsersReactions:", error);
    return [];
  }
};

