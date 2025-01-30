export const createUser = async (body) => {
    const response = await fetch('http://localhost:3000/users', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};

export const readUser = async (query) => {
    const response = await fetch('http://localhost:3000/users?' + new URLSearchParams(query), {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

export const updateUser = async (id, body) => {
    const response = await fetch('http://localhost:3000/users/' + id, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};

export const deleteUser = async (id) => {
    const response = await fetch('http://localhost:3000/users/' + id, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

export const restoreUser = async (id) => {
    const response = await fetch('http://localhost:3000/users/' + id, {
        method: "PATCH",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};


export const loginUser = async (body) => {
    const response = await fetch('http://localhost:3000/users/login', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};

export const confirmUser = async (body) => {
    const response = await fetch('http://localhost:3000/users/confirm', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    return await response.json();
};
