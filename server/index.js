import cors from "cors";
import express from "express";

import pool from "./database/db.js";
import session from "express-session";
import passport from "passport";

import ChannelMembersRouter from "./routes/ChannelMembers.js";
import ChannelPermissionsRouter from "./routes/ChannelPermissions.js";
import ChannelsRouter from "./routes/Channels.js";
import PermissionsRouter from "./routes/Permissions.js";
import RolePermissionsRouter from "./routes/RolePermissions.js";
import RolesRouter from "./routes/Roles.js";
import UsersRouter from "./routes/Users.js";
import WorkspaceInvitationsRouter from "./routes/WorkspaceInvitations.js";
import WorkspaceMembersRouter from "./routes/WorkspaceMembers.js";
import WorkspacePermissionsRouter from "./routes/WorkspacePermissions.js";
import WorkspacesRouter from "./routes/Workspaces.js";

import EmailRouter from "./routes/Services/Email.js";

import "./services/passport/FacebookStrategy.js";
import "./services/passport/GoogleStrategy.js";

const PORT = process.env.PORT
const app = express();

app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));



pool.getConnection().then((connection) => {
    console.log("Connected to database!");
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cors({
        origin: ["http://localhost:5000", "http://localhost:3000"], // localhost 3000 pour le callback de google
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    }));

    app.use("/users/", UsersRouter);
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

    app.use("/email/", EmailRouter);

    app.listen(PORT, () =>
        console.log(`Server running on http://localhost:${PORT} !`)
    );

    connection.release();
}).catch((error) => {
    console.error({
        when: "Index > ConnectDB",
        error: 1,
        error_message: error,
    });

    pool.end();
});

export default app;
