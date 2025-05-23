import pool from "../database/db.js";
import { ERRORS, createErrorResponse } from "../app/ErrorHandler.js";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";


export const createChannel = async (request, io = null) => {

    try {
        const { user_id, workspace_id, name, is_private = false } = request.body;

        if (!user_id) return createErrorResponse(ERRORS.USER_ID_NOT_PROVIDED);
        if (!workspace_id) return createErrorResponse(ERRORS.WORKSPACE_ID_NOT_PROVIDED);
        if (!name) return createErrorResponse(ERRORS.NAME_NOT_PROVIDED);

        const users = await pool.query("SELECT * FROM users WHERE id = ?", [user_id]);
        const user = users[0];

        if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
        if (user.deleted_at !== null) return createErrorResponse(ERRORS.USER_DELETED);

        const workspaces = await pool.query("SELECT * FROM workspaces WHERE id = ?", [workspace_id]);
        const workspace = workspaces[0];

        // veruf si utilisateur n'est pas guest (role_id = 3)
        const [roles] = await pool.query(
            "SELECT role_id FROM workspace_members WHERE user_id = ? AND workspace_id = ?",
            [user_id, workspace_id]
        );

        const role_id = roles?.role_id

        if (!role_id) {
            return createErrorResponse({ code: 403, message: "Rôle non trouvé dans ce workspace." });
        }

        if (role_id === 3) {
            return createErrorResponse({ code: 403, message: "Permission refusée : les invités ne peuvent pas créer de channel." });
        }

        if (!workspace) return createErrorResponse(ERRORS.WORKSPACE_NOT_FOUND);
        if (workspace.deleted_at !== null) return createErrorResponse(ERRORS.WORKSPACE_DELETED);

        const result = await pool.query(
            "INSERT INTO channels (workspace_id, name, is_private, user_id) VALUES (?, ?, ?, ?)",
            [workspace_id, name, is_private ?? false, user_id]
        );

        const newChannel = {
            id: result.insertId,
            workspace_id,
            name,
            is_private,
            user_id
        };

        if (io) {
            if (is_private) {
                // Envoie uniquement au createur
                io.to(`user_${user_id}`).emit("channelCreated", newChannel);
            } else {
                // Channel public -> tout le monde dans le workspace
                io.to(`workspace_${workspace_id}`).emit("channelCreated", newChannel);
            }
        }


        return newChannel;
    } catch (error) {
        console.error("Fatal error in createChannel:", error);
        return createErrorResponse({ code: 500, message: error.message });
    }
};



export const readChannel = async (request) => {
    if (request.params?.id) {
        const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [request.params.id]);
        if (!channel) return createErrorResponse(ERRORS.CHANNEL_NOT_FOUND);
        return channel;
    }

    let query = "SELECT * FROM channels";
    let where = [];
    let params = [];

    if (request.query?.workspace_id) {
        where.push("workspace_id = ?");
        params.push(request.query.workspace_id);
    }

    if (request.query?.name) {
        where.push("name = ?");
        params.push(request.query.name);
    }

    if (request.query?.is_private) {
        where.push("is_private = ?");
        params.push(request.query.is_private);
    }

    if (request.query?.user_id) {
        where.push("(is_private = 0 OR id IN (SELECT channel_id FROM channel_members WHERE user_id = ?))");
        params.push(request.query.user_id);
    }

    if (where.length > 0) {
        query += " WHERE " + where.join(" AND ");
    }

    return pool.query(query, params);
};


export const updateChannel = async (request) => {
    if (!request.params.id) return createErrorResponse(ERRORS.ID_NOT_PROVIDED);

    const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [request.params.id]);
    if (!channel) return createErrorResponse(ERRORS.CHANNEL_NOT_FOUND);
    if (channel.deleted_at !== null) return createErrorResponse(ERRORS.CHANNEL_DELETED);

    if (request.body.workspace_id) {
        const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.body.workspace_id]);
        if (!workspace) return createErrorResponse(ERRORS.WORKSPACE_NOT_FOUND);
        if (workspace.deleted_at !== null) return createErrorResponse(ERRORS.WORKSPACE_DELETED);
    }

    if (request.body.user_id) {
        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.body.user_id]);
        if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
        if (user.deleted_at !== null) return createErrorResponse(ERRORS.USER_DELETED);
    }

    return pool.query("UPDATE channels SET workspace_id = ?, name = ?, is_private = ?, user_id = ?, updated_at = NOW() WHERE id = ?", [
        request.body.workspace_id || channel.workspace_id,
        request.body.name || channel.name,
        request.body.is_private || channel.is_private,
        request.body.user_id || channel.user_id,
        request.params.id
    ]);

}

export const deleteChannel = async (request) => {
    if (!request.params.id) return createErrorResponse(ERRORS.ID_NOT_PROVIDED);

    const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [request.params.id]);
    if (!channel) return createErrorResponse(ERRORS.CHANNEL_NOT_FOUND);
    if (channel.deleted_at !== null) return createErrorResponse(ERRORS.CHANNEL_ALREADY_DELETED);

    return pool.query("UPDATE channels SET deleted_at = NOW() WHERE id = ?", [request.params.id]);
};

export const restoreChannel = async (request) => {
    if (!request.params.id) return createErrorResponse(ERRORS.ID_NOT_PROVIDED);

    const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [request.params.id]);
    if (!channel) return createErrorResponse(ERRORS.CHANNEL_NOT_FOUND);
    if (channel.deleted_at === null) return createErrorResponse(ERRORS.CHANNEL_NOT_DELETED);

    return pool.query("UPDATE channels SET deleted_at = NULL WHERE id = ?", [request.params.id]);
};


export const joinChannel = async ({ channel_id, workspace_id }) => {
    if (!channel_id || !workspace_id) {
        return { error: 1, error_message: "Channel ID ou Workspace ID manquant." };
    }

    const [channel] = await pool.query("SELECT workspace_id FROM channels WHERE id = ?", [channel_id]);

    if (!channel || channel.workspace_id !== workspace_id) {
        return { error: 1, error_message: "Channel introuvable ou non autorisé." };
    }

    const messages = await fetchMessagesForChannel(channel_id, workspace_id);
    return { messages };
};


export const sendMessage = async ({ channel_id, user_id, content }, io = null) => {
    if (!channel_id || !user_id || !content) {
        return createErrorResponse({
            code: 400,
            message: "Les champs requis sont manquants."
        });
    }

    try {
        const result = await pool.query(
            "INSERT INTO messages (channel_id, user_id, content) VALUES (?, ?, ?)",
            [channel_id, user_id, content]
        );

        const [channel] = await pool.query(
            "SELECT name FROM channels WHERE id = ?",
            [channel_id]
        );

        const [user] = await pool.query(
            "SELECT username FROM users WHERE id = ?",
            [user_id]
        );

        const message = {
            id: result.insertId,
            channel_id,
            user_id,
            content,
            username: user.username,
            channel_name: channel.name

        };

        if (io) {
            io.to(`channel_${channel_id}`).emit("receiveMessage", message);
        }

        return { result: message };
    } catch (err) {
        console.error("Erreur sendMessage:", err);
        return createErrorResponse({ code: 500, message: err.message });
    }
};


export const fetchMessagesForChannel = async ({ channel_id, workspace_id }) => {
    if (!channel_id || !workspace_id) {
        return {
            error: 1,
            error_message: "channel_id ou workspace_id manquant."
        };
    }

    try {
        // Récupère tous les messages, fichiers et réactions associés à ce canal et workspace
        const rows = await pool.query(`
            SELECT 
                messages.id AS message_id,                
                messages.channel_id,                     
                messages.user_id,                          
                messages.content,                         
                messages.created_at,                      
                users.username,                           
                files.file_path AS attachment,            
                reactions.emoji,                           
                reactions.user_id AS reactor_id          
            FROM messages
            JOIN users ON messages.user_id = users.id
            JOIN channels ON messages.channel_id = channels.id
            LEFT JOIN files ON files.message_id = messages.id AND files.deleted_at IS NULL
            LEFT JOIN reactions ON reactions.message_id = messages.id AND reactions.removed_at IS NULL
            WHERE messages.channel_id = ? AND channels.workspace_id = ?
            ORDER BY messages.created_at ASC
        `, [channel_id, workspace_id]);

        // Crée une map pour regrouper les lignes par message_id
        const msgMap = new Map();

        for (const row of rows) {
            // Si le msg existe pas encor dans la map on l'add
            if (!msgMap.has(row.message_id)) {
                msgMap.set(row.message_id, {
                    id: row.message_id,
                    channel_id: row.channel_id,
                    user_id: row.user_id,
                    content: row.content,
                    created_at: row.created_at,
                    username: row.username,
                    attachment: row.attachment,
                    reactions: [] // on va remplir ça juste après
                });
            }

            const msg = msgMap.get(row.message_id);


            //  Si la row contient bien un emoji et son auteur
            if (row.emoji && row.reactor_id) {

                //  Cherche si une réaction avec ce même emoji existe déjà pour ce message
                // Exemple : si msg.reactions = [{ emoji: "😂", user_ids: [1, 2] }]
                // et que row.emoji === "🔥", alors .find() ne trouve rien → reaction = undefined
                let reaction = msg.reactions.find(r => r.emoji === row.emoji);

                //  donc si !reaction, on ajoute un nouvel obj dans le tableau des reactions
                // avec cet emoji et une liste vide d’utilisateurs
               // on ajoute { emoji: "🔥", user_ids: [] }
                if (!reaction) {
                    reaction = { emoji: row.emoji, user_ids: [] };
                    msg.reactions.push(reaction);
                }

                // Exemple final :
                
                // msg.reactions = [
                //  { emoji: "😂", user_ids: [1, 2] }, //là en loccurence j'ai un autre user qui fais un emoji "😂" alors reaction sera true
                //  donc l'objet avec le tableau user_ids existe déjà et
                // on y pushera simplement le nouvel auteur -> reaction.user_ids.push(row.reactor_id);
                //  
                // 
                // { emoji: "🔥", user_ids: [5] } //là reaction était false puisque personne n'avait
                //  réagit avec l'emoji flamme sur ce message 
                //donc nouvel objet ajouté dans le tableau des réactions
                // ]

            // On ajoute l’utilisateur qui a réagi dans le tableau user_ids
                reaction.user_ids.push(row.reactor_id);
            }

        }


        // Voilà un exemple d'un message dans la map envoyée au client :
        // {
        //   id: 42,              
        //   channel_id: 10,      
        //   user_id: 7,          
        //   content: "Hello !",   
        //   created_at: "2025-05-23T10:15:00.000Z", 
        //   username: "alice",   
        //   attachment: null,   
        //   reactions: [          
        //     {
        //       emoji: "😂",       
        //       user_ids: [3, 5]   
        //     },
        //     {
        //       emoji: "👍",
        //       user_ids: [3]
        //     }
        //   ]
        // };


        // Transforme la map en array pour le front
        return {
            messages: Array.from(msgMap.values()),
            error: 0
        };

    } catch (error) {
        console.error("Erreur fetchMessagesForChannel:", error);
        return {
            error: 1,
            error_message: error.message
        };
    }
};





const uploadDir = path.resolve("uploads/");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });


export const uploadFileToChannel = async (file, { channel_id, user_id }) => {
    if (!file || !channel_id || !user_id) {
        return {
            error: 1,
            error_message: "Champs requis manquants (file, channel_id, user_id)",
        };
    }

    const filePath = `/uploads/${uuidv4()}-${file.originalname}`;
    const absolutePath = path.join(uploadDir, path.basename(filePath));
    fs.renameSync(file.path, absolutePath);

    try {
        const result = await pool.query(
            "INSERT INTO messages (channel_id, user_id, content) VALUES (?, ?, '')",
            [channel_id, user_id]
        );

        const message_id = result.insertId;

        await pool.query(
            "INSERT INTO files (message_id, file_path) VALUES (?, ?)",
            [message_id, filePath]
        );

        return {
            result: {
                fileUrl: filePath,
                message_id,
            },
            error: 0,
        };
    } catch (error) {
        return {
            error: 1,
            error_message: error.message,
        };
    }
};


export const addReaction = async ({ message_id, user_id, emoji }) => {
    try {
        // Insertion ou restauration d'une réaction
        await pool.query(
            `INSERT INTO reactions (message_id, user_id, emoji)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE removed_at = NULL`,
            [message_id, user_id, emoji]
        );

        // Récupère toutes les réactions actives (non supprimées)
        const rawReactions = await pool.query(
            `SELECT emoji, user_id
             FROM reactions
             WHERE message_id = ? AND removed_at IS NULL`,
            [message_id]
        );

        // Regroupe les réactions par emoji
        const reactionsMap = new Map();
        for (const { emoji, user_id } of rawReactions) {
            if (!reactionsMap.has(emoji)) {
                reactionsMap.set(emoji, []);
            }
            reactionsMap.get(emoji).push(user_id);
        }

        // Transforme en tableau [{ emoji: "❤️", user_ids: [1, 2] }, ...]
        const reactions = Array.from(reactionsMap.entries()).map(([emoji, user_ids]) => ({
            emoji,
            user_ids,
        }));

        // Infos message
        const [messageData] = await pool.query(
            `SELECT m.channel_id, m.user_id AS author_id, c.workspace_id
             FROM messages m
             JOIN channels c ON m.channel_id = c.id
             WHERE m.id = ?`,
            [message_id]
        );

        if (!messageData) {
            return { error: "Message introuvable" };
        }

        const [userData] = await pool.query(
            `SELECT username FROM users WHERE id = ?`,
            [user_id]
        );

        const reactingUsername = userData ? userData.username : "Un utilisateur";

        return {
            reactions,
            channel_id: messageData.channel_id,
            author_id: messageData.author_id,
            workspace_id: messageData.workspace_id,
            reactingUsername,
        };
    } catch (error) {
        console.error("Erreur addReaction (controller):", error);
        return { error };
    }
};

export const removeReaction = async ({ message_id, user_id, emoji }) => {
    try {
        // Marque la réaction comme supprimée
        await pool.query(
            `UPDATE reactions
             SET removed_at = NOW()
             WHERE message_id = ? AND user_id = ? AND emoji = ?`,
            [message_id, user_id, emoji]
        );

        // Récupère toutes les réactions actives
        const rawReactions = await pool.query(
            `SELECT emoji, user_id
             FROM reactions
             WHERE message_id = ? AND removed_at IS NULL`,
            [message_id]
        );

        // Regroupe les réactions par emoji
        const reactionsMap = new Map();
        for (const { emoji, user_id } of rawReactions) {
            if (!reactionsMap.has(emoji)) {
                reactionsMap.set(emoji, []);
            }
            reactionsMap.get(emoji).push(user_id);
        }

        // Format final : [{ emoji, user_ids }]
        const reactions = Array.from(reactionsMap.entries()).map(([emoji, user_ids]) => ({
            emoji,
            user_ids,
        }));

        // Infos message pour émettre l'update
        const [messageData] = await pool.query(
            `SELECT channel_id FROM messages WHERE id = ?`,
            [message_id]
        );

        if (!messageData) {
            return { error: "Message introuvable" };
        }

        return {
            reactions,
            channel_id: messageData.channel_id,
        };
    } catch (error) {
        console.error("Erreur removeReaction (controller):", error);
        return { error };
    }
};

export const getUsersForReaction = async ({ message_id, emoji }) => {
    try {
        const result = await pool.query(
            `SELECT u.username
       FROM reactions r
       JOIN users u ON u.id = r.user_id
       WHERE r.message_id = ? AND r.emoji = ? AND r.removed_at IS NULL`,
            [message_id, emoji]
        );

        return result.map(r => r.username);
    } catch (err) {
        console.error("Erreur SQL dans getUsersForReaction:", err);
        throw err;
    }
};

