export const createWorkspacePermission = async (body) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/permissions`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};

export const readWorkspacePermission = async (query) => {
    const response = query.id ? await fetch(`${process.env.REACT_APP_API_URL}workspaces/permissions/` + query.id, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }) : await fetch(`${process.env.REACT_APP_API_URL}workspaces/permissions?` + new URLSearchParams(query), {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

export const deleteWorkspacePermission = async (user_id, workspace_id, permission_id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/permissions/user/` + user_id + '/workspace/' + workspace_id + '/permission/' + permission_id, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};