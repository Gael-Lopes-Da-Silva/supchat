import { Server } from 'socket.io';
import pool from "./database/db.js";
import {
    createWorkspace,
    readUserWorkspaces,
    joinWorkspace,
    readWorkspace
} from './controllers/Workspaces.js';
import {
    createChannel,
    readChannel
} from "./controllers/Channels.js";
import { readUsersByIds, readUser } from './controllers/Users.js';

import { joinWorkspaceViaInvitation } from './controllers/WorkspaceInvitations.js';
import { createChannelMember } from './controllers/ChannelMembers.js';
import { fetchMessagesForChannel } from "./controllers/Channels.js";

const connectedUsers = new Map();

const broadcastConnectedUsers = async (io) => {
    const userIds = [...connectedUsers.values()];
    if (userIds.length === 0) {
        io.emit("connectedUsers", []);
        return;
    }

    try {
        const { result } = await readUsersByIds(userIds);
        io.emit("connectedUsers", result);
    } catch (err) {
        console.error("Erreur récupération des utilisateurs connectés :", err);
        io.emit("connectedUsers", []);
    }
};



export default function setupSocketServer(server) {
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:5000", "http://localhost:3000", /^http:\/\/192\.168\.1\.\d+:5000$/],
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on("registerUser", (userId) => {
            if (!userId) return;
            socket.join(`user_${userId}`);
            socket.userId = userId;
            connectedUsers.set(socket.id, userId);
            broadcastConnectedUsers(io); // on garde une trace des users connectés et on broadcast la liste
        });


        socket.on("disconnect", () => {
            connectedUsers.delete(socket.id);
            broadcastConnectedUsers(io); // quand un user déco, on MAJ la liste pour tout le monde
        });

        socket.on("getUserWorkspaces", async ({ user_id }) => {
            const response = await readUserWorkspaces({ user_id });
            socket.emit("userWorkspaces", response.result || []); // envoie les workspaces de l'utilisateur
        });

        socket.on("createWorkspace", async (data) => {
            const request = { body: data, socket };
            const newWs = await createWorkspace(request, io);

            socket.emit("workspaceCreatedSuccess", newWs); // renvoie le nouveau workspace au user qui cree le ws

            if (newWs?.result && !newWs.result.is_private) {
                // si le ws  est public → broadcast à tous sauf au user qui la creee
                socket.broadcast.emit("publicWorkspaceCreated", newWs.result);
            }
        });

      socket.on("joinWorkspaceWithInvitation", async ({ token, user_id, username }) => {
    try {
        const result = await joinWorkspaceViaInvitation({ token, user_id, username, socket, io });

        const workspaceId = result.result.workspace_id;

        // Utilise readWorkspace
        const workspace = await readWorkspace({ params: { id: workspaceId } });

        // Utilise readChannel pour récupérer tous les channels du workspace
        const allChannels = await readChannel({ query: { workspace_id: workspaceId } });

        // Envoie les données au client (workspace + channels)
        socket.emit("joinWorkspaceSuccess", {
            workspace,
            channels: allChannels,
        });

        // Notifie les autres que quelqu’un a rejoint
        socket.to(`workspace_${workspaceId}`).emit("workspaceUserJoined", {
            workspace_id: workspaceId,
            username,
        });
    } catch (err) {
        console.error("Erreur joinWorkspaceWithInvitation:", err);
        socket.emit("joinWorkspaceError", { message: err.message });
    }
});


        socket.on("joinWorkspace", async (data) => {
            const workspace_id = typeof data === 'object' && data.workspace_id ? data.workspace_id : data;

            try {
                const result = await joinWorkspace({ workspace_id, user_id: socket.userId });

                if (result.error) {
                    return socket.emit("joinWorkspaceError", { message: result.error_message });
                }

                // on quitte l’ancien workspace si on en avait un
                if (socket.workspaceId) socket.leave(`workspace_${socket.workspaceId}`);

                socket.workspaceId = workspace_id;
                socket.join(`workspace_${workspace_id}`); // on rejoint la room du nouveau workspace

                // si c’est la première fois qu’on rejoint → notif les autres
                if (!result.isAlreadyMember) {
                    const userRows = await pool.query("SELECT username FROM users WHERE id = ?", [socket.userId]);
                    const username = userRows[0]?.username;

                    socket.to(`workspace_${workspace_id}`).emit("workspaceUserJoined", {
                        workspace_id,
                        username,
                    });
                }

                socket.emit("joinWorkspaceSuccess", {
                    workspace: result.workspace,
                    channels: result.channels,
                });

                broadcastConnectedUsers(io); // MAJ de la liste globale
            } catch (err) {
                console.error("Erreur joinWorkspace (côté socket):", err);
                socket.emit("joinWorkspaceError", { message: err.message });
            }
        });

        socket.on("createChannel", async (data) => {
            const request = { body: data };
            const newChannel = await createChannel(request, io);
            socket.emit("channelCreatedSuccess", newChannel); // envoie direct au créateur
        });

        socket.on("joinChannel", async ({ channel_id, workspace_id }) => {
            if (!channel_id || !workspace_id) {
                return socket.emit("joinChannelError", {
                    message: "channel_id ou workspace_id manquant."
                });
            }

            try {
                socket.join(`channel_${channel_id}`); // on rejoint la room du canal

                const result = await fetchMessagesForChannel({ channel_id, workspace_id });

                if (result?.error) {
                    socket.emit("joinChannelError", { message: result.error_message });
                } else {
                    socket.emit("receiveMessages", result.messages); // on balance les messages à l’arrivée
                }
            } catch (error) {
                console.error("Erreur joinChannel (server):", error);
                socket.emit("joinChannelError", { message: error.message });
            }
        });

        socket.on("inviteToChannel", async (data) => {
            const result = await createChannelMember({ body: data }, io);

            if (result?.error) {
                socket.emit("inviteToChannelError", { message: result.error_message });
            } else {
                const { channel } = result;

                const sockets = await io.fetchSockets();
                for (const s of sockets) {
                    if (s.userId === data.user_id || s.userId === data.inviter_id) {
                        s.join(`channel_${channel.id}`);
                        s.emit("channelJoined", { channel }); // on leur envoie le canal qu’ils ont rejoint
                    }
                }

                socket.emit("inviteToChannelSuccess", result);
            }
        });

        socket.on("sendMessage", async (msg) => {
            const { user_id, content, channel_id } = msg;

            if (!user_id || !content || !channel_id) {
                return socket.emit("sendMessageError", { message: "Champs manquants." });
            }

            try {
                // insertion du message en BDD
                const result = await pool.query(
                    "INSERT INTO messages (channel_id, user_id, content) VALUES (?, ?, ?)",
                    [channel_id, user_id, content]
                );

                const user = await readUser({ params: { id: user_id } });
                console.log("user", user);
                const channel = await readChannel({ params: { id: channel_id } });
                const workspace = await readWorkspace({ params: { id: channel.workspace_id } });

                // on détecte les mentions (@user)
                const allUsers = await pool.query("SELECT id, username FROM users");
                const usernameMap = new Map(allUsers.map(u => [u.username.toLowerCase(), u.id]));

                // au pluriel ici car potentiellement je peux mentionner plusieurs personnes dans un msg
                const mentionedUsernames = content
                    .split(/\s+/)
                    .filter(word => word.startsWith("@"))
                    .map(word => word.slice(1).toLowerCase())
                    .filter(username => usernameMap.has(username)); // garde que les usernames qui sont en bdd


                // recup les id des utilisateurs mentionnés   
                const mentionedUserIds = mentionedUsernames.map(username => usernameMap.get(username));

                const messageData = {
                    id: result.insertId,
                    username: user.username,
                    content,
                    channel_id,
                    channel_name: channel.name,
                    workspace_id: channel.workspace_id,
                    workspace_name: workspace.name,
                    user_id,
                    mentioned_user_ids: mentionedUserIds,
                };

                // envoie du msg à tous ceux du canal
                io.to(`channel_${channel_id}`).emit("receiveMessage", messageData);


                // ici on envoie receiveMessage à tous les utilisateurs connectés. 
                // Cet event sera catch par le front et
                //  on pourra envoyer une notif à quelqu'un qui n'a pas forcément de channel ou le bon workspace de selectionné
                for (const uid of connectedUsers.values()) {
                    if (uid !== user_id) {
                        io.to(`user_${uid}`).emit("receiveMessage", messageData);
                    }
                }

            } catch (error) {
                console.error("Erreur dans sendMessage:", error);
                socket.emit("sendMessageError", { message: "Erreur interne serveur." });
            }
        });

        socket.on("connect_error", (err) => {
            console.error("WebSocket connection failed:", err);
        });

    });
}
