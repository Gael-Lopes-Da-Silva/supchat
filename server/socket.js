import { Server } from 'socket.io';
import pool from "./database/db.js";
import {
    createWorkspace,
    readUserWorkspaces,
    joinWorkspace,
    readWorkspace
} from './controllers/Workspaces.js';
import { readUsersByIds, readUser } from './controllers/Users.js';
import { joinWorkspaceViaInvitation } from './controllers/WorkspaceInvitations.js';
import { createChannelMember } from './controllers/ChannelMembers.js';
import {
    fetchMessagesForChannel, 
    addReaction, 
    removeReaction,
    createChannel,
    readChannel
} from "./controllers/Channels.js";
import { readWorkspaceMembersByWorkspaceId } from "./controllers/WorkspaceMembers.js";


const connectedUsers = new Map();
const userStatuses = new Map();
const broadcastConnectedUsers = async (io) => {
    const userIds = [...connectedUsers.values()];
    if (userIds.length === 0) {
        io.emit("connectedUsers", []);
        return;
    }

    try {
        const { result } = await readUsersByIds(userIds);

        const usersWithStatus = result.map(u => ({
            ...u,
            status: userStatuses.get(u.id)
        }));

        io.emit("connectedUsers", usersWithStatus);
    } catch (err) {
        console.error("Erreur récupération des utilisateurs connectés :", err);
        io.emit("connectedUsers", []);
    }
};

const broadcastMessage = (io, message, senderId) => {
    const channelRoom = `channel_${message.channel_id}`;

    // on send à tous ceux du canal
    io.to(channelRoom).emit("receiveMessage", message);

    // et ici à tout ceux hors du canal
    for (const [socketId, uid] of connectedUsers) {
        if (uid === senderId) continue;

        const socketUser = io.sockets.sockets.get(socketId);
        const isInChannel = socketUser?.rooms.has(channelRoom);

        if (!isInChannel) {
            io.to(`user_${uid}`).emit("receiveMessage", message);
        }
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
        socket.on("userStatusUpdate", ({ user_id, status }) => {
            if (user_id && status) {
                userStatuses.set(user_id, status);
                io.emit("userStatusBroadcast", { user_id, status });
            }
        });


        socket.on("disconnect", () => {
            connectedUsers.delete(socket.id);
            userStatuses.delete(socket.userId);

            broadcastConnectedUsers(io); // quand un user déco -> maj dla liste des users connectés
        });

        socket.on("getUserWorkspaces", async ({ user_id }) => {
            const response = await readUserWorkspaces({ user_id });
            socket.emit("userWorkspaces", response.result); // envoie les workspaces de l'utilisateur
        });

        socket.on("getWorkspaceMembers", async ({ workspace_id }) => {
            try {
                const request = { query: { workspace_id } };
                const members = await readWorkspaceMembersByWorkspaceId(request);
                socket.emit("workspaceMembers", members);
            } catch (err) {
                console.error("Erreur getWorkspaceMembers:", err);
                socket.emit("workspaceMembers", []);
            }
        });


        socket.on("createWorkspace", async (data) => {
            const request = { body: data, socket };
            const newWs = await createWorkspace(request, io);

            socket.emit("workspaceCreatedSuccess", newWs);

            if (newWs && !newWs.is_private) {
                socket.broadcast.emit("publicWorkspaceCreated", newWs);
            }
        });


        socket.on("joinWorkspaceWithInvitation", async ({ token, user_id, username }) => {
            try {
                const result = await joinWorkspaceViaInvitation({ token, user_id, username, socket, io });

                const workspaceId = result.result.workspace_id;

                const workspace = await readWorkspace({ params: { id: workspaceId } });

                const allChannels = await readChannel({ query: { workspace_id: workspaceId } });
                // on envoie cet event pour mettre à jour les workspace et channels que vient de join l'user
                socket.emit("joinWorkspaceSuccess", {
                    workspace,
                    channels: allChannels,
                });

                // trigger la notif pour les autres users du workspace comme quoi quelqu'un a join
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
                socket.join(`workspace_${workspace_id}`); // on rejoint le nioveau ws

                // si c’est la première fois qu’on rejoint -> notif les autres
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

                socket.channelId = channel_id;

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
            const { user_id, content, channel_id, attachment } = msg;

            if (!user_id || (!content && !attachment) || !channel_id) {
                return socket.emit("sendMessageError", { message: "Champs manquants." });
            }

            try {
                // insert en bdd
                const result = await pool.query(
                    "INSERT INTO messages (channel_id, user_id, content) VALUES (?, ?, ?)",
                    [channel_id, user_id, content]
                );



                const message_id = result.insertId;

                if (attachment) {
                    await pool.query(
                        "INSERT INTO files (message_id, file_path) VALUES (?, ?)",
                        [message_id, attachment]
                    );
                }

                const user = await readUser({ params: { id: user_id } });
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
                    id: message_id,
                    username: user.username,
                    content,
                    attachment,
                    channel_id,
                    channel_name: channel.name,
                    workspace_id: channel.workspace_id,
                    workspace_name: workspace.name,
                    user_id,
                    mentioned_user_ids: mentionedUserIds,
                };
                // ici on envoie receiveMessage à tous les utilisateurs connectés. 
                // Cet event sera catch par le front et
                //  on pourra envoyer une notif à quelqu'un qui n'a pas forcément de channel ou le bon workspace de selectionné
                // ...
                broadcastMessage(io, messageData, user_id);




            } catch (error) {
                console.error("Erreur dans sendMessage:", error);
                socket.emit("sendMessageError", { message: "Erreur interne serveur." });
            }
        });

        socket.on("broadcastAttachedMsg", (message) => {
            if (!message || !message.channel_id || !message.user_id) return;
            broadcastMessage(io, message, message.user_id);
        });



        socket.on("addReaction", async ({ message_id, user_id, emoji }) => {
            const result = await addReaction({ message_id, user_id, emoji });
            if (result.error) {
                socket.emit("addReactionError", { message: "Erreur ajout réaction." });
                return;
            }

            const { reactions, channel_id, author_id, workspace_id, reactingUsername } = result;

            io.to(`channel_${channel_id}`).emit("updateReactions", {
                message_id,
                reactions,
            });

            if (author_id !== user_id) {
                io.to(`user_${author_id}`).emit("reactionNotification", {
                    message: `${reactingUsername} a réagi à votre message avec ${emoji}`,
                    message_id,
                    emoji,
                    workspace_id,
                    channel_id,
                });
            }
        });

        socket.on("removeReaction", async ({ message_id, user_id, emoji }) => {
            const result = await removeReaction({ message_id, user_id, emoji });
            if (result.error) {
                socket.emit("removeReactionError", { message: "Erreur suppression réaction." });
                return;
            }

            const { reactions, channel_id } = result;

            io.to(`channel_${channel_id}`).emit("updateReactions", {
                message_id,
                reactions,
            });
        });


        socket.on("connect_error", (err) => {
            console.error("WebSocket connection failed:", err);
        });

    });
    return io;
}
