import dotenv from "dotenv/config";

const PORT = process.env.PORT || 3000;
const response = await fetch(`http://localhost:${PORT}/users/update`, {
    method: "PUT",
    body: JSON.stringify({
        id: 1,
        username: "",
        password: "",
        email: ""
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8",
    },
});

const data = await response.json();
console.log(data);