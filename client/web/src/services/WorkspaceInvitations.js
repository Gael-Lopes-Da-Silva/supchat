export const createWorkspaceInvitation = async (body) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/invitations`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};

export const joinWorkspaceWithInvitation = async (body) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/invitations/join`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};


export const readWorkspaceInvitation = async (query) => {
    const response = query.id ? await fetch(`${process.env.REACT_APP_API_URL}workspaces/invitations/` + query.id, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }) : await fetch(`${process.env.REACT_APP_API_URL}workspaces/invitations?` + new URLSearchParams(query), {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

export const updateWorkspaceInvitation = async (id, body) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/invitations/` + id, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};

export const deleteWorkspaceInvitation = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/invitations/` + id, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

export const restoreWorkspaceInvitation = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/invitations/` + id, {
        method: "PATCH",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};