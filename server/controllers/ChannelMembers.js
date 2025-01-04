import pool from "../database/db.js";
import { ERROR_CODES, createErrorResponse } from "./ErrorHandler/Errors.js";

export const createChannelMember = async (request) => {
    if (!request.body.user_id) return createErrorResponse(ERROR_CODES.USER_ID_NOT_PROVIDED);
    if (!request.body.channel_id) return createErrorResponse(ERROR_CODES.CHANNEL_ID_NOT_PROVIDED);
    if (!request.body.role_id) return createErrorResponse(ERROR_CODES.ROLE_ID_NOT_PROVIDED);
    
    const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [request.body.channel_id]);
    if (!channel) return createErrorResponse(ERROR_CODES.CHANNEL_NOT_FOUND);
    if (channel.deleted_at !== null) return createErrorResponse(ERROR_CODES.CHANNEL_DELETED);

    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.body.user_id]);
    if (!user) return createErrorResponse(ERROR_CODES.USER_NOT_FOUND);
    if (channel.deleted_at !== null) return createErrorResponse(ERROR_CODES.USER_DELETED);

    const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [request.body.role_id]);
    if (!role) return createErrorResponse(ERROR_CODES.ROLE_NOT_FOUND);
    
    if (await pool.query("SELECT * FROM channel_members WHERE user_id = ? AND channel_id = ?", [
        request.body.user_id,
        request.body.channel_id
    ])) return createErrorResponse(ERROR_CODES.USER_ALREADY_EXIST_IN_CHANNEL);

    return pool.query("INSERT INTO channel_members (channel_id, user_id, role_id) VALUES (?, ?, ?, ?, ?)", [
        request.body.channel_id,
        request.body.user_id,
        request.body.role_id
    ]);
}

export const readChannelMember = async (request) => {
    if (request.params.id) {
        const [channelMember] = await pool.query("SELECT * FROM channel_members WHERE id = ?", [request.body.id]);
        if (!channelMember) return createErrorResponse(ERROR_CODES.CHANNEL_MEMBER_NOT_FOUND);
        return channelMember;
    } else {
        let query = "SELECT * FROM channel_members"
        let where = [];
        let params = [];

        if (request.query.channel_id) {
            const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [request.query.channel_id]);
            if (!channel) return createErrorResponse(ERROR_CODES.CHANNEL_NOT_FOUND);
            where.push("channel_id = ?");
            params.push(request.query.channel_id);
        }

        if (request.query.user_id) {
            const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.query.user_id]);
            if (!user) return createErrorResponse(ERROR_CODES.USER_NOT_FOUND);
            where.push("user_id = ?");
            params.push(request.query.user_id);
        }

        if (request.query.role_id) {
            const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [request.query.role_id]);
            if (!role) return createErrorResponse(ERROR_CODES.ROLE_NOT_FOUND);
            where.push("role_id = ?");
            params.push(request.query.role_id);
        }

        if (where.length > 0) {
            query += " WHERE " + where.join(" AND ");
        }

        return pool.query(query, params);
    }
}

export const updateChannelMember = async (request) => {
    if (!request.params.id) return createErrorResponse(ERROR_CODES.ID_NOT_PROVIDED);

    const [channelMember] = await pool.query("SELECT * FROM channel_members WHERE id = ?", [request.params.id]);
    if (!channelMember) return createErrorResponse(ERROR_CODES.CHANNEL_MEMBER_NOT_FOUND);
    if (channelMember.deleted_at !== null) return createErrorResponse(ERROR_CODES.CHANNEL_MEMBER_DELETED);

    if (request.body.channel_id) {
        const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [request.body.channel_id]);
        if (!channel) return createErrorResponse(ERROR_CODES.CHANNEL_NOT_FOUND);
        if (channel.deleted_at !== null) return createErrorResponse(ERROR_CODES.CHANNEL_DELETED);
    }

    if (request.body.user_id) {
        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.body.user_id]);
        if (!user) return createErrorResponse(ERROR_CODES.USER_NOT_FOUND);
        if (user.deleted_at !== null) return createErrorResponse(ERROR_CODES.USER_DELETED);
    }

    if (request.body.role_id) {
        const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [request.body.role_id]);
        if (!role) return createErrorResponse(ERROR_CODES.ROLE_NOT_FOUND);
    }
    
    if (await pool.query("SELECT * FROM channel_members WHERE user_id = ? AND channel_id = ?", [
        request.body.user_id,
        request.body.channel_id
    ])) return createErrorResponse(ERROR_CODES.USER_ALREADY_EXIST_IN_CHANNEL);

    return pool.query("UPDATE channel_members SET channel_id = ?, user_id = ?, role_id = ?, updated_at = NOW() WHERE id = ?", [
        request.body.channel_id || channelMember.channel_id,
        request.body.user_id || channelMember.user_id,
        request.body.role_id || channelMember.role_id,
        request.params.id
    ]);
}

export const deleteChannelMember = async (request) => {
    const [channelMember] = await pool.query("SELECT * FROM channel_members WHERE id = ?", [request.params.id]);
    if (!channelMember) return createErrorResponse(ERROR_CODES.CHANNEL_MEMBER_NOT_FOUND);
    if (channelMember.deleted_at !== null) return createErrorResponse(ERROR_CODES.CHANNEL_MEMBER_ALREADY_DELETED);

    return pool.query("UPDATE channel_members SET deleted_at = NOW() WHERE id = ?", [request.params.id]);
}

export const restoreChannelMember = async (request) => {
    const [channelMember] = await pool.query("SELECT * FROM channel_members WHERE id = ?", [request.params.id]);
    if (!channelMember) return createErrorResponse(ERROR_CODES.CHANNEL_MEMBER_NOT_FOUND);
    if (channelMember.deleted_at === null) return createErrorResponse(ERROR_CODES.CHANNEL_MEMBER_NOT_DELETED);

    return pool.query("UPDATE channel_members SET deleted_at = NULL WHERE id = ?", [request.params.id]);
}