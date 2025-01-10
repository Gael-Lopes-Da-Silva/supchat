import pool from "../database/db.js";
import { ERRORS, createErrorResponse } from "../app/ErrorHandler.js";

export const createChannelPermission = async (request) => {
    if (!request.body.user_id) return createErrorResponse(ERRORS.USER_ID_NOT_PROVIDED);
    if (!request.body.channel_id) return createErrorResponse(ERRORS.CHANNEL_ID_NOT_PROVIDED);
    if (!request.body.permission_id) return createErrorResponse(ERRORS.PERMISSION_ID_NOT_PROVIDED);

    if (request.body.user_id) {
        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.body.user_id]);
        if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
        if (user.deleted_at !== null) return createErrorResponse(ERRORS.USER_DELETED);
    }

    if (request.body.channel_id) {
        const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [request.body.channel_id]);
        if (!channel) return createErrorResponse(ERRORS.CHANNEL_NOT_FOUND);
        if (channel.deleted_at !== null) return createErrorResponse(ERRORS.CHANNEL_DELETED);
    }

    if (request.body.permission_id) {
        const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [request.body.permission_id]);
        if (!permission) return createErrorResponse(ERRORS.PERMISSION_NOT_FOUND);
    }

    return pool.query("INSERT INTO channel_permissions (user_id, channel_id, permission_id) VALUES (?, ?, ?)", [
        request.body.user_id,
        request.body.channel_id,
        request.body.permission_id
    ]);
}

export const readChannelPermission = async (request) => {
    if (request.params.user_id && request.params.channel_id && request.params.permission_id) {
        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.params.user_id]);
        if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
        if (user.deleted_at !== null) return createErrorResponse(ERRORS.USER_DELETED);

        const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [request.params.channel_id]);
        if (!channel) return createErrorResponse(ERRORS.CHANNEL_NOT_FOUND);
        if (channel.deleted_at !== null) return createErrorResponse(ERRORS.CHANNEL_DELETED);

        const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [request.params.permission_id]);
        if (!permission) return createErrorResponse(ERRORS.PERMISSION_NOT_FOUND);

        const [channelPermission] = await pool.query("SELECT * FROM channel_permissions WHERE user_id = ? AND channel_id = ? AND permission_id = ?", [
            request.params.user_id,
            request.params.channel_id,
            request.params.permission_id
        ]);
        if (!channelPermission) return createErrorResponse(ERRORS.CHANNEL_PERMISSION_NOT_FOUND);
        return channelPermission;
    } else {
        let query = "SELECT * FROM channel_permissions"
        let where = [];
        let params = [];

        if (request.query.user_id) {
            const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.query.user_id]);
            if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
            if (user.deleted_at !== null) return createErrorResponse(ERRORS.USER_DELETED);
            where.push("user_id = ?");
            params.push(request.query.user_id);
        }

        if (request.query.channel_id) {
            const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [request.query.channel_id]);
            if (!channel) return createErrorResponse(ERRORS.CHANNEL_NOT_FOUND);
            if (channel.deleted_at !== null) return createErrorResponse(ERRORS.CHANNEL_DELETED);
            where.push("channel_id = ?");
            params.push(request.query.channel_id);
        }

        if (request.query.permission_id) {
            const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [request.query.permission_id]);
            if (!permission) return createErrorResponse(ERRORS.PERMISSION_NOT_FOUND);
            where.push("permission_id = ?");
            params.push(request.query.permission_id);
        }

        if (where.length > 0) {
            query += " WHERE " + where.join(" AND ");
        }

        return pool.query(query, params);
    }
}

export const deleteChannelPermission = async (request) => {
    if (!request.params.user_id) return createErrorResponse(ERRORS.USER_ID_NOT_PROVIDED);
    if (!request.params.channel_id) return createErrorResponse(ERRORS.CHANNEL_ID_NOT_PROVIDED);
    if (!request.params.permission_id) return createErrorResponse(ERRORS.PERMISSION_ID_NOT_PROVIDED);

    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.params.user_id]);
    if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
    if (user.deleted_at !== null) return createErrorResponse(ERRORS.USER_DELETED);

    const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [request.params.channel_id]);
    if (!channel) return createErrorResponse(ERRORS.CHANNEL_NOT_FOUND);
    if (channel.deleted_at !== null) return createErrorResponse(ERRORS.CHANNEL_DELETED);

    const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [request.params.permission_id]);
    if (!permission) return createErrorResponse(ERRORS.PERMISSION_NOT_FOUND);

    return pool.query("DELETE FROM channel_permissions WHERE user_id = ? AND channel_id = ? AND permission_id = ?", [
        request.params.user_id,
        request.params.channel_id,
        request.params.permission_id
    ]);
}