export const createWorkspace = async (body) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};


export const getPublicWorkspaces = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/public`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json(); 
};



export const readWorkspace = async ({ id }) => {
    console.log("Reading workspace with ID:", id);
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log("Workspace data fetched:", data);
        return data;
    } catch (error) {
        console.error("Error fetching workspace data:", error);
        throw error;
    }
};


export const updateWorkspace = async (id, body) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/` + id, {
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
    const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/` + id, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

export const restoreWorkspace = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/` + id, {
        method: "PATCH",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};