export const createRolePermission = async(body) => {
    const response = await fetch('http://localhost:3000/roles/permissions', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};

export const readRolePermission = async (query) => {
    const response = await fetch('http://localhost:3000/roles/permissions?' + new URLSearchParams(query), {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

export const deleteRolePermission = async (role_id, permission_id) => {
    const response = await fetch('http://localhost:3000/roles/permissions/role/' + role_id + '/permission/' + permission_id, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};