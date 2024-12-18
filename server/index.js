import express from "express";
import dotenv from "dotenv";
import pool from "./database/db.js";

import UsersRouter from "./routes/Users.js";
import WorkspacesRouter from "./routes/Workspaces.js";
import ChannelsRouter from "./routes/Channels.js";

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

pool.getConnection().then((connection) => {
    console.log("Connected to database!");

    app.get("/", (request, response) => {
        response.sendFile("index.html", { root: "public" });
    });

    app.use("/users/", UsersRouter);
    app.use("/workspaces/", WorkspacesRouter);
    app.use("/channels/", ChannelsRouter);

    app.listen(PORT, () =>
        console.log(`Server running on http://localhost:${PORT} !`)
    );

    connection.release();
}).catch((error) => {
    console.error({
        error: "Database Connection Error",
        message: error.message,
    });

    pool.end();
});

export default app;
