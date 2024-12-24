import dotenv from "dotenv";

export const loginUser = async (email, password) => {
    const response = await fetch(`${process.env.API_URL}/users/login`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            password
        }),
    });

    if (!response.ok) throw new Error('Connexion échouée');

    return await response.json();
};