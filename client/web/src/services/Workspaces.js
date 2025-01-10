export const createWorkspace = async (body) => {
    const response = await fetch('http://localhost:3000/workspaces', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};

export const readWorkspace = async (query) => {
    const response = query.id
        ? await fetch('http://localhost:3000/workspaces/' + query.id, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        : await fetch('http://localhost:3000/workspaces?' + new URLSearchParams(query), {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });

    return await response.json();
};

export const updateWorkspace = async (id, body) => {
    const response = await fetch('http://localhost:3000/workspaces/' + id, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};

export const deleteWorkspace = async (id) => {
    const response = await fetch('http://localhost:3000/workspaces/' + id, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

export const restoreWorkspace = async (id) => {
    const response = await fetch('http://localhost:3000/workspaces/' + id, {
        method: "PATCH",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};