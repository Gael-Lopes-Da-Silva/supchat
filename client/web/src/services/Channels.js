
export const createChannel = async ({ name, description, is_private, workspace_id, user_id }) => {
    console.log('Creating channel with:', { name, description, is_private, workspace_id, user_id });

    const response = await fetch(`${process.env.REACT_APP_API_URL}channels`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
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
    const response = query.id ? await fetch(`${process.env.REACT_APP_API_URL}channels/` + query.id, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }) : await fetch(`${process.env.REACT_APP_API_URL}channels?` + new URLSearchParams(query), {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

export const updateChannel = async (id, body) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}channels/` + id, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};

export const deleteChannel = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}channels/` + id, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

export const restoreChannel = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}channels/` + id, {
        method: "PATCH",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

export const checkUserAlreadyInChannel = async (channel_id, user_id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}channels/members?channel_id=${channel_id}&user_id=${user_id}`);
      const data = await res.json();
      return data.result && data.result.length > 0;
    } catch (err) {
      console.error("Erreur vérification membre existant :", err);
      return false;
    }
  };
  

export const addUserToChannel = async ({ channel_id, user_id, role_id = 2,inviter_id }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}channels/members`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
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
  

  export const getUserChannelIds = async (user_id, workspace_id) => {
    try {
        const response = await fetch(
            `${process.env.REACT_APP_API_URL}channels/members?user_id=${user_id}&workspace_id=${workspace_id}`,
            {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await response.json();

        return data.result.map(member => member.channel_id);
    } catch (err) {
        console.error("Erreur getUserChannelIds:", err);
        return [];
    }
};
