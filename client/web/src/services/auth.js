
import dotenv from "dotenv";

export const loginUser = async (email, password) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error('Connexion échouée');

    return await response.json();
};