import dotenv from "dotenv";

dotenv.config();
import "./services/passport/GoogleStrategy.js";
import "./services/passport/FacebookStrategy.js";
import express from "express";
import cors from "cors";

import pool from "./database/db.js";

import UsersRouter from "./routes/Users.js";
import StatusRouter from "./routes/Status.js";
import PermissionsRouter from "./routes/Permissions.js";
import WorkspacesRouter from "./routes/Workspaces.js";
import WorkspaceInvitationsRouter from "./routes/WorkspaceInvitations.js";
import WorkspaceMembersRouter from "./routes/WorkspaceMembers.js";
import WorkspacePermissionsRouter from "./routes/WorkspacePermissions.js";
import ChannelsRouter from "./routes/Channels.js";
import ChannelMembersRouter from "./routes/ChannelMembers.js";
import ChannelPermissionsRouter from "./routes/ChannelPermissions.js";
import RolesRouter from "./routes/Roles.js";
import RolePermissionsRouter from "./routes/RolePermissions.js";

const PORT = process.env.PORT 
const app = express();



pool.getConnection().then((connection) => {
    console.log("Connected to database!");
    
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cors({
        origin: "http://localhost:5000",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    }));

    app.use("/users/", UsersRouter);
    app.use("/status/", StatusRouter);
    app.use("/permissions/", PermissionsRouter);

    app.use("/workspaces/invitations/", WorkspaceInvitationsRouter);
    app.use("/workspaces/permissions/", WorkspacePermissionsRouter);
    app.use("/workspaces/members/", WorkspaceMembersRouter);
    app.use("/workspaces/", WorkspacesRouter);

    app.use("/channels/permissions/", ChannelPermissionsRouter);
    app.use("/channels/members/", ChannelMembersRouter);
    app.use("/channels/", ChannelsRouter);

    app.use("/roles/permissions/", RolePermissionsRouter);
    app.use("/roles/", RolesRouter);

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
