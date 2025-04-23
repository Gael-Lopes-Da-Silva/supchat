import cors from "cors";
import express from "express";
import http from 'http';
import { Server } from 'socket.io';
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



import { createWorkspace } from './controllers/Workspaces.js';
import { joinWorkspaceWithInvitation } from './controllers/WorkspaceInvitations.js';
import { readUserWorkspaces } from './controllers/Workspaces.js';

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

export const io = new Server(server, {
    cors: corsOptions,
});

const connectedUsers = new Map();

async function broadcastConnectedUsers() {
    const userIds = Array.from(connectedUsers.values());

    if (userIds.length === 0) {
        io.emit("connectedUsers", []);
        return;
    }

    try {
        const rows = await pool.query(
            `SELECT id, username FROM users WHERE id IN (${userIds.map(() => '?').join(',')})`,
            userIds
        );

        io.emit("connectedUsers", rows); 
    } catch (err) {
        console.error("Erreur récupération des usernames connectés :", err);
    }
}


io.on('connection', (socket) => {
    console.log('Connected to the WebSocket server');

    socket.on("registerUser", (userId) => {
        if (!userId) return;
        socket.join(`user_${userId}`);
        socket.userId = userId;
        connectedUsers.set(socket.id, userId);
        console.log(`User ${userId} joined room user_${userId}`);
    
        broadcastConnectedUsers();
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
        connectedUsers.delete(socket.id);
        broadcastConnectedUsers();
    });
    

    socket.on('joinChannel', async (channelId) => {
        if (!socket.workspaceId) {
            console.error("User hasn't joined any workspace.");
            return;
        }

        try {
            
            const messages = await fetchMessagesForChannel(channelId, socket.workspaceId);

            
            if (socket.workspaceId) {
                socket.join(`channel_${channelId}`);  
                socket.emit('receiveMessages', messages);  
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    });

    socket.on('sendMessage', async (message) => {

        if (!message.channel_id || !message.user_id || !message.content) {
            console.error('Error: incomplete message', message);
            return;
        }

        try {
            const result = await pool.query(
                "INSERT INTO messages (channel_id, user_id, content) VALUES (?, ?, ?)",
                [message.channel_id, message.user_id, message.content]
            );

            const [user] = await pool.query(
                "SELECT username FROM users WHERE id = ?",
                [message.user_id]
            );

            const savedMessage = {
                id: result.insertId,
                channel_id: message.channel_id,
                user_id: message.user_id,
                username: user.username, 
                content: message.content
            };

            
            io.to(`channel_${message.channel_id}`).emit('receiveMessage', savedMessage);
        } catch (err) {
            console.error('SQL Error:', err);
        }
    });

    socket.on('createChannel', async (channelData) => {
    
        try {
            const result = await pool.query(
                "INSERT INTO channels (workspace_id, name, is_private, user_id) VALUES (?, ?, ?, ?)",
                [channelData.workspace_id, channelData.name, channelData.is_private, channelData.user_id]
            );
    
            const newChannel = {
                id: result.insertId,
                workspace_id: channelData.workspace_id,
                name: channelData.name,
                is_private: channelData.is_private,
                user_id: channelData.user_id
            };
    
            io.to(`workspace_${channelData.workspace_id}`).emit('channelCreated', newChannel);
        } catch (err) {
            console.error('Error creating channel:', err);
        }
    });

    
    socket.on('joinWorkspace', (workspaceId) => {
        if (!workspaceId) return console.error('Workspace ID is missing');

        if (socket.workspaceId) {
            console.log(`User is leaving workspace_${socket.workspaceId}`);
            socket.leave(`workspace_${socket.workspaceId}`);
        }

        console.log(`User joined workspace_${workspaceId}`);
        socket.join(`workspace_${workspaceId}`);
        socket.workspaceId = workspaceId;

        
        pool.query("SELECT * FROM channels WHERE workspace_id = ?", [workspaceId], (err, channels) => {
            if (err) {
                console.error('Error fetching channels for workspace:', err);
                return;
            }

            
            socket.emit('workspaceChannels', channels);

            
            if (selectedChannel.id) {
                const messages = fetchMessagesForChannel(selectedChannel.id, workspaceId);
                socket.emit('receiveMessages', messages);
            }
        });
    });


    socket.on("createWorkspace", async (data) => {
        try {
            const request = { body: data };
            const newWorkspace = await createWorkspace(request);
    
            
            socket.emit("workspaceCreatedSuccess", newWorkspace);
        } catch (error) {
            console.error("Erreur création workspace via socket:", error);
            socket.emit("workspaceCreatedError", { error: error.message });
        }
    });

    socket.on("getUserWorkspaces", async ({ user_id }) => {
        try {
            const response = await readUserWorkspaces({ user_id });
    
            if (response.error) {
                socket.emit("userWorkspaces", []);
                return;
            }
    
            socket.emit("userWorkspaces", response.result);
        } catch (error) {
            console.error("Erreur socket getUserWorkspaces:", error);
            socket.emit("userWorkspaces", []);
        }
    });

    socket.on("joinWorkspaceWithInvitation", async ({ token, user_id, username }) => {
        try {
            const response = await joinWorkspaceWithInvitation({ token, user_id });
    
            const workspaceId = response?.result?.workspace_id;
            if (!workspaceId) throw new Error("Aucun workspace_id retourné");
    
            const [workspaceData] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [workspaceId]);
    
            socket.join(`workspace_${workspaceId}`);
            socket.workspaceId = workspaceId;
    
            io.to(`workspace_${workspaceId}`).emit("workspaceUserJoined", {
                workspace_id: workspaceId,
                username,
            });
    
            socket.emit("joinWorkspaceSuccess", workspaceData);


        } catch (error) {
            console.error("Erreur socket joinWorkspace:", error);
            socket.emit("joinWorkspaceError", { message: error.message });
        }
    });
    


    socket.on('connect_error', (error) => {
        console.error('WebSocket connection failed:', error);
    });
});

const fetchMessagesForChannel = async (channelId, workspaceId) => {
    if (!channelId || !workspaceId) {
        console.error("Channel ID or Workspace ID is missing.");
        return [];
    }

    let connection;

    try {
        connection = await pool.getConnection();

        const messagesQuery = `
            SELECT m.id, m.channel_id, m.user_id, m.content, m.created_at, u.username
            FROM messages m
            JOIN users u ON m.user_id = u.id
            JOIN channels c ON m.channel_id = c.id
            WHERE m.channel_id = ? AND c.workspace_id = ?
            ORDER BY m.created_at ASC
        `;

        const messages = await connection.query(messagesQuery, [channelId, workspaceId]);

        return messages.map(msg => ({
            id: msg.id,
            channel_id: msg.channel_id,
            user_id: msg.user_id,
            content: msg.content,
            created_at: msg.created_at,
            username: msg.username,
        }));

    } catch (error) {
        console.error('❌ Error fetching messages:', error);
        return [];
    } finally {
        if (connection) connection.release();
    }
};

pool.getConnection().then((connection) => {
    console.log("Connected to database!");

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
