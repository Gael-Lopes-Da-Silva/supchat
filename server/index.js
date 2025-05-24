import cors from "cors";
import express from "express";
import http from 'http';
import pool from "./database/db.js";
import path from 'path';
import applySecurityMiddleware from "./middlewares/Security.js";

import ChannelMembersRouter from "./routes/ChannelMembers.js";
import ChannelsRouter from "./routes/Channels.js";
import RolesRouter from "./routes/Roles.js";
import UsersRouter from "./routes/Users.js";
import WorkspaceInvitationsRouter from "./routes/WorkspaceInvitations.js";
import WorkspaceMembersRouter from "./routes/WorkspaceMembers.js";

import WorkspacesRouter from "./routes/Workspaces.js";
import EmailRouter from "./routes/Email.js";

import "./services/FacebookStrategy.js";
import "./services/GoogleStrategy.js";

import setupSocketServer from './socket.js'; 

const app = express();
const PORT = process.env.PORT;

const corsOptions = {
    origin: [
        "http://localhost:5000",
        "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
};


app.use(cors(corsOptions));

applySecurityMiddleware(app);

app.use('/uploads', (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(path.join(process.cwd(), 'uploads')));



const server = http.createServer(app);
const io = setupSocketServer(server);

app.set("io", io);
app.use("/users/", UsersRouter);
app.use("/workspaces/invitations/", WorkspaceInvitationsRouter);
app.use("/workspaces/members/", WorkspaceMembersRouter);
app.use("/workspaces/", WorkspacesRouter);
app.use("/channels/members/", ChannelMembersRouter);
app.use("/channels/", ChannelsRouter);
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
