import express from "express";
import mariadb from "mariadb";

const pool = mariadb.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    connectionLimit: 5
});

pool.getConnection().then((connection) => {
    
}).catch((error) => {
    console.error({
        "error": "Database Connection Error",
        "message": error,
    });
    
    pool.end();
});

import UsersRouter from "./routes/Users.js";
import WorkspacesRouter from "./routes/Workspaces.js";
import ChannelsRouter from "./routes/Channels.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (request, response) => {
    response.sendFile("index.html", { root: "public" });
});

app.use("/users/", UsersRouter);
app.use("/workspaces/", WorkspacesRouter);
app.use("/channels/", ChannelsRouter);

export default app;