import dotenv from "dotenv";

export const loginUser = async (email, password) => {
    const response = await fetch("http://localhost:3000/users/login", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            password
        }),
    });
    
    if (!response.ok) throw Error("Connexion impossible");

    return await response.json();
};