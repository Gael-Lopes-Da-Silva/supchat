export const createChannelMember = async (body) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}channels/members`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};

export const readChannelMember = async (query) => {
    const response = query.id ? await fetch(`${process.env.REACT_APP_API_URL}channels/members/` + query.id, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }) : await fetch(`${process.env.REACT_APP_API_URL}channels/members?` + new URLSearchParams(query), {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

export const updateChannelMember = async (id, body) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}channels/members/` + id, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};

export const deleteChannelMember = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}channels/members/` + id, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

export const restoreChannelMember = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}channels/members/` + id, {
        method: "PATCH",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};