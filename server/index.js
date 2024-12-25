import express from "express";
import dotenv from "dotenv";
import pool from "./database/db.js";

import UsersRouter from "./routes/Users.js";
import StatusRouter from "./routes/Status.js";
import WorkspacesRouter from "./routes/Workspaces.js";
import WorkspaceInvitationsRouter from "./routes/WorkspaceInvitations.js";
import WorkspaceMembersRouter from "./routes/WorkspaceMembers.js";
import ChannelsRouter from "./routes/Channels.js";
import ChannelMembersRouter from "./routes/ChannelMembers.js";

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.API_PORT;

pool.getConnection().then((connection) => {
    console.log("Connected to database!");

    app.get("/", (request, response) => {
        response.sendFile("index.html", { root: "public" });
    });

    app.use("/users/", UsersRouter);
    app.use("/status/", StatusRouter);
    app.use("/workspaces/", WorkspacesRouter);
    app.use("/workspaces/invitations/", WorkspaceInvitationsRouter);
    app.use("/workspaces/members/", WorkspaceMembersRouter);
    app.use("/channels/", ChannelsRouter);
    app.use("/channels/members/", ChannelMembersRouter);

    app.listen(PORT, () =>
        console.log(`Server running on http://localhost:${PORT} !`)
    );

    connection.release();
}).catch((error) => {
    console.error({
        when: "Index > ConnectDB",
        error: 1,
        error_message: error.message,
    });

    pool.end();
});

export default app;
