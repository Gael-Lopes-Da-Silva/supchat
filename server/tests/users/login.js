import dotenv from "dotenv/config";

const PORT = process.env.PORT || 3000;
const response = await fetch(`http://localhost:${PORT}/users/login`, {
    method: "GET",
    body: JSON.stringify({
        email: "",
        password: ""
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8",
    },
});

const data = await response.json();
console.log(data);