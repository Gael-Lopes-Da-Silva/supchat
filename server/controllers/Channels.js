import pool from "../database/db.js";
import { ERRORS, createErrorResponse } from "../app/ErrorHandler.js";

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
        return createErrorResponse({
            code: 400,
            message: "channel_id ou workspace_id manquant."
        });
    }

    let connection;

    try {
        connection = await pool.getConnection();

        const query = `
            SELECT m.id, m.channel_id, m.user_id, m.content, m.created_at, u.username
            FROM messages m
            JOIN users u ON m.user_id = u.id
            JOIN channels c ON m.channel_id = c.id
            WHERE m.channel_id = ? AND c.workspace_id = ?
            ORDER BY m.created_at ASC
        `;

        const messages = await connection.query(query, [channel_id, workspace_id]);

        return { messages: messages.map(m => ({ ...m })), error: 0 };
    } catch (error) {
        console.error("Erreur fetchMessagesForChannel:", error);
        return createErrorResponse({ code: 500, message: error.message });
    } finally {
        if (connection) connection.release();
    }
};
