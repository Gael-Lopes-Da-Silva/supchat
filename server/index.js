import cors from "cors";
import express from "express";
import http from 'http';
import session from "express-session";
import passport from "passport";
import pool from "./database/db.js";

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

import setupSocketServer from './socket.js'; 

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

const corsOptions = {
    origin: [
        "http://localhost:5000",
        "http://localhost:3000",
        /^http:\/\/192\.168\.1\.\d+:5000$/,
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

const server = http.createServer(app);
setupSocketServer(server); 

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

pool.getConnection().then((connection) => {
    console.log("Connected to database!");
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on http://localhost:${PORT} !`);
    });
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
