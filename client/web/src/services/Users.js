export const createUser = async (userData) => {
    return fetch(`${process.env.REACT_APP_API_URL}users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    })
    .then((response) => response.json())
    .then((data) => {
        return data;
    })
    .catch((error) => {
        return { error: true, message: "Erreur serveur" };
    });
};

export const readUser = async (query, api_url) => {
    let url;

    if (query.id) {
        url = `${api_url}users/${query.id}`;
    } else if (query.confirm_token) {
        url = `${api_url}users?confirm_token=${query.confirm_token}`;
    } else {
        return { error: true, message: "Paramètre requis manquant." };
    }

    return fetch(url, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
    .then((response) => response.json())
    .catch((error) => {
        return { error: true, message: error.message };
    });
};

export const updateUser = async (userId, updatedData, api_url) => {
    if (!userId) {
        return { error: true, message: "ID utilisateur manquant" };
    }

    const url = `${api_url}users/${userId}`;

    return fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
    })
    .then((response) => {
        if (!response.ok) {
            return { error: true, message: `Erreur HTTP ${response.status}` };
        }
        return response.json();
    })
    .catch((error) => {
        return { error: true, message: "Erreur serveur" };
    });
};

export const deleteUser = async (id) => {
    return fetch(`${process.env.REACT_APP_API_URL}users/${id}`, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
    .then((response) => response.json())
    .catch((error) => {
        return { error: true, message: "Erreur serveur" };
    });
};

export const restoreUser = async (id) => {
    return fetch(`${process.env.REACT_APP_API_URL}users/${id}`, {
        method: "PATCH",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
    .then((response) => response.json())
    .catch((error) => {
        return { error: true, message: "Erreur serveur" };
    });
};

export const loginUser = async (body) => {
    return fetch(`${process.env.REACT_APP_API_URL}users/login`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    })
    .then((response) => response.json())
    .catch((error) => {
        return { error: true, message: "Erreur serveur" };
    });
};

export const getUserProviders = async (userId) => {
    return fetch(`${process.env.REACT_APP_API_URL}users/${userId}/providers`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
    .then((response) => {
        if (!response.ok) {
            return { error: true, message: `Erreur récupération des providers: ${response.statusText}` };
        }
        return response.json();
    })
    .catch((error) => {
        return { error: true, message: "Erreur serveur" };
    });
};

export const linkProvider = async (userId, provider, providerId) => {
    return fetch(`${process.env.REACT_APP_API_URL}users/link-provider`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: userId,
            provider,
            provider_id: providerId,
        }),
    })
    .then((response) => {
        if (!response.ok) {
            return { error: true, message: `Erreur lors de la liaison du provider: ${response.statusText}` };
        }
        return response.json();
    })
    .catch((error) => {
        return { error: true, message: "Erreur serveur" };
    });
};
