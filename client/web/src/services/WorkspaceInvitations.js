export const createWorkspaceInvitation = async(body) => {
    const response = await fetch('http://localhost:3000/workspaces/invitations', {
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
    const response = await fetch('http://localhost:3000/workspaces/invitations?' + new URLSearchParams(query), {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

export const updateWorkspaceInvitation = async (id, body) => {
    const response = await fetch('http://localhost:3000/workspaces/invitations/' + id, {
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
    const response = await fetch('http://localhost:3000/workspaces/invitations/' + id, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

export const restoreWorkspaceInvitation = async (id) => {
    const response = await fetch('http://localhost:3000/workspaces/invitations/' + id, {
        method: "PATCH",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};