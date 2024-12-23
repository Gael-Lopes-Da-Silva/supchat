import dotenv from "dotenv/config";

const PORT = process.env.PORT || 3000;
const response = await fetch(`http://localhost:${PORT}/workspaces/create`, {
    method: "POST",
    body: JSON.stringify({
        
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8",
    },
});

const data = await response.json();
console.log(data);