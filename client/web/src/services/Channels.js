
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