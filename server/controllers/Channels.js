import pool from "../database/db.js";
import { ERRORS, createErrorResponse } from "../app/ErrorHandler.js";

export const createChannel = async (request) => {
    if (!request.body.user_id) return createErrorResponse(ERRORS.USER_ID_NOT_PROVIDED);
    if (!request.body.workspace_id) return createErrorResponse(ERRORS.WORKSPACE_ID_NOT_PROVIDED);
    if (!request.body.name) return createErrorResponse(ERRORS.NAME_NOT_PROVIDED);

    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.body.user_id]);
    if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
    if (user.deleted_at !== null) return createErrorResponse(ERRORS.USER_DELETED);

    const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.body.workspace_id]);
    if (!workspace) return createErrorResponse(ERRORS.WORKSPACE_NOT_FOUND);
    if (workspace.deleted_at !== null) return createErrorResponse(ERRORS.WORKSPACE_DELETED);
    
    return pool.query("INSERT INTO channels (workspace_id, name, is_private, user_id) VALUES (?, ?, ?, ?, ?)", [
        request.body.workspace_id,
        request.body.name,
        request.body.is_private || false,
        request.body.user_id
    ]);
}

export const readChannel = async (request) => {
    if (request.params.id) {
        const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [request.body.id]);
        if (!channel) return createErrorResponse(ERRORS.CHANNEL_NOT_FOUND);
        return channel;
    } else {
        let query = "SELECT * FROM channels"
        let where = [];
        let params = [];

        if (request.query.workspace_id) {
            const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.query.workspace_id]);
            if (!workspace) return createErrorResponse(ERRORS.WORKSPACE_NOT_FOUND);
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
            const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.query.user_id]);
            if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
            where.push("user_id = ?");
            params.push(request.query.user_id);
        }

        if (where.length > 0) {
            query += " WHERE " + where.join(" AND ");
        }

        return pool.query(query, params);
    }
}

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
    
    return pool.query("UPDATE channels SET workspace_id = ?, name = ?, is_private = ?, role = ?, user_id = ?, updated_at = NOW() WHERE id = ?", [
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
}

export const restoreChannel = async (request) => {
    if (!request.params.id) return createErrorResponse(ERRORS.ID_NOT_PROVIDED);

    const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [request.params.id]);
    if (!channel) return createErrorResponse(ERRORS.CHANNEL_NOT_FOUND);
    if (channel.deleted_at === null) return createErrorResponse(ERRORS.CHANNEL_NOT_DELETED);

    return pool.query("UPDATE channels SET deleted_at = NULL WHERE id = ?", [request.params.id]);
}