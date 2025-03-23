import pool from "../database/db.js";
import { ERRORS, createErrorResponse } from "../app/ErrorHandler.js";
import { io } from "../index.js";

export const createChannel = async (request) => {
    console.log("📥 Full request.body:", request.body);

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

        io.to(`workspace_${workspace_id}`).emit("channelCreated", newChannel);

        return newChannel;
    } catch (error) {
        console.error("Fatal error in createChannel:", error);
        return createErrorResponse({ code: 500, message: error.message });
    }
};



export const readChannel = async (request) => {

    if (request.params.id) {
        const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [request.params.id]);
        if (!channel) return createErrorResponse(ERRORS.CHANNEL_NOT_FOUND);
        return channel;
    } else {
        let query = "SELECT * FROM channels";
        let where = [];
        let params = [];

        if (request.query.workspace_id) {
            where.push("workspace_id = ?");
            params.push(request.query.workspace_id);
        }

        if (request.query.name) {
            where.push("name = ?");
            params.push(request.query.name);
        }

        if (request.query.is_private) {
            where.push("is_private = ?");
            params.push(request.query.is_private);
        }

        if (request.query.user_id) {
            where.push("user_id = ?");
            params.push(request.query.user_id);
        }

        if (where.length > 0) {
            query += " WHERE " + where.join(" AND ");
        }
        console.log("Generated SQL Query:", query);
        console.log("Query Parameters:", params);

        return pool.query(query, params);
    }
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
