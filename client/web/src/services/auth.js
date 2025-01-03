export const loginUser = async (email, password) => {
    const response = await fetch('http://localhost:3000/users/login', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    });

    if (!response.ok) return "";

    return await response.json();
};

export const registerUser = async (username, email, password) => {
    const response = await fetch('http://localhost:3000/users', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
        }),
    });

    if (!response.ok) return "";

    return await response.json();
};