export const createWorkspaceMember = async(body) => {
    const response = await fetch('http://localhost:3000/workspaces/members', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};

export const readWorkspaceMember = async (query) => {
    const response = await fetch('http://localhost:3000/workspaces/members?' + new URLSearchParams(query), {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

export const updateWorkspaceMember = async (id, body) => {
    const response = await fetch('http://localhost:3000/workspaces/members/' + id, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};

export const deleteWorkspaceMember = async (id) => {
    const response = await fetch('http://localhost:3000/workspaces/members/' + id, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

export const restoreWorkspaceMember = async (id) => {
    const response = await fetch('http://localhost:3000/workspaces/members/' + id, {
        method: "PATCH",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};