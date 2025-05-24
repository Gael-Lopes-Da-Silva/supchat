import pool from "../database/db.js";
import { ERRORS, createErrorResponse } from "../services/ErrorHandler.js";

export const createChannelMember = async (request, io = null) => {
  const { user_id, channel_id, role_id = 2, inviter_id } = request.body;
 // àrole id a par défaut à membre


    try {
        // récupération des infos du channel et de l'invitant
        const channelRows = await pool.query("SELECT * FROM channels WHERE id = ?", [channel_id]);
        const inviterRows = await pool.query("SELECT username FROM users WHERE id = ?", [inviter_id]);

        const channel = channelRows[0]; 
        const inviterUsername = inviterRows[0]?.username;

        if (!channel) return createErrorResponse(ERRORS.CHANNEL_NOT_FOUND);


        //check si deja membre pour pas faire de doublon
        const existing = await pool.query(
            "SELECT * FROM channel_members WHERE channel_id = ? AND user_id = ? AND deleted_at IS NULL",
            [channel_id, user_id]
        );
        if (existing.length > 0) {
            return createErrorResponse({ code: 409, message: "L'utilisateur est déjà membre de ce canal." });
        }

        const result = await pool.query(
            "INSERT INTO channel_members (channel_id, user_id, role_id) VALUES (?, ?, ?)",
            [channel_id, user_id, role_id]
        );

        if (io && inviterUsername) {
            io.to(`user_${user_id}`).emit("channelInvitation", {
                channel_name: channel.name,
                inviter: inviterUsername,
            });

            io.to(`user_${user_id}`).emit("channelJoined", { channel });
        }

        return {
            id: result.insertId,
            user_id,
            channel_id,
            role_id,
            channel,
        };

    } catch (error) {
        console.error("Erreur createChannelMember:", error);
        return createErrorResponse({ code: 500, message: error.message });
    }
};




export const readChannelMember = async (request) => {
    if (request.params.id) {
        const [channelMember] = await pool.query("SELECT * FROM channel_members WHERE id = ?", [request.params.id]);
        if (!channelMember) return createErrorResponse(ERRORS.CHANNEL_MEMBER_NOT_FOUND);
        return channelMember;
    } else {
        let query = `
        SELECT cm.*, c.workspace_id, u.username
        FROM channel_members cm
        JOIN channels c ON cm.channel_id = c.id
        JOIN users u ON cm.user_id = u.id
    `;
    
        let where = [];
        let params = [];

        if (request.query.channel_id) {
            const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [request.query.channel_id]);
            if (!channel) return createErrorResponse(ERRORS.CHANNEL_NOT_FOUND);
            where.push("cm.channel_id = ?");
            params.push(request.query.channel_id);
        }

        if (request.query.user_id) {
            const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.query.user_id]);
            if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
            where.push("cm.user_id = ?");
            params.push(request.query.user_id);
        }

        if (request.query.role_id) {
            const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [request.query.role_id]);
            if (!role) return createErrorResponse(ERRORS.ROLE_NOT_FOUND);
            where.push("cm.role_id = ?");
            params.push(request.query.role_id);
        }

        if (where.length > 0) {
            query += " WHERE " + where.join(" AND ");
        }

        return pool.query(query, params);
    }
};


export const updateChannelMember = async (request) => {
    if (!request.params.id) return createErrorResponse(ERRORS.ID_NOT_PROVIDED);

    const [channelMember] = await pool.query("SELECT * FROM channel_members WHERE id = ?", [request.params.id]);
    if (!channelMember) return createErrorResponse(ERRORS.CHANNEL_MEMBER_NOT_FOUND);
    if (channelMember.deleted_at !== null) return createErrorResponse(ERRORS.CHANNEL_MEMBER_DELETED);

    if (request.body.channel_id) {
        const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [request.body.channel_id]);
        if (!channel) return createErrorResponse(ERRORS.CHANNEL_NOT_FOUND);
        if (channel.deleted_at !== null) return createErrorResponse(ERRORS.CHANNEL_DELETED);
    }

    if (request.body.user_id) {
        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.body.user_id]);
        if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
        if (user.deleted_at !== null) return createErrorResponse(ERRORS.USER_DELETED);
    }

    if (request.body.role_id) {
        const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [request.body.role_id]);
        if (!role) return createErrorResponse(ERRORS.ROLE_NOT_FOUND);
    }

    if (await pool.query("SELECT * FROM channel_members WHERE user_id = ? AND channel_id = ?", [
        request.body.user_id,
        request.body.channel_id
    ])) return createErrorResponse(ERRORS.USER_ALREADY_EXIST_IN_CHANNEL);

    return pool.query("UPDATE channel_members SET channel_id = ?, user_id = ?, role_id = ?, updated_at = NOW() WHERE id = ?", [
        request.body.channel_id || channelMember.channel_id,
        request.body.user_id || channelMember.user_id,
        request.body.role_id || channelMember.role_id,
        request.params.id
    ]);
}

export const deleteChannelMember = async (request) => {
    const [channelMember] = await pool.query("SELECT * FROM channel_members WHERE id = ?", [request.params.id]);
    if (!channelMember) return createErrorResponse(ERRORS.CHANNEL_MEMBER_NOT_FOUND);
    if (channelMember.deleted_at !== null) return createErrorResponse(ERRORS.CHANNEL_MEMBER_ALREADY_DELETED);

    return pool.query("UPDATE channel_members SET deleted_at = NOW() WHERE id = ?", [request.params.id]);
}

export const restoreChannelMember = async (request) => {
    const [channelMember] = await pool.query("SELECT * FROM channel_members WHERE id = ?", [request.params.id]);
    if (!channelMember) return createErrorResponse(ERRORS.CHANNEL_MEMBER_NOT_FOUND);
    if (channelMember.deleted_at === null) return createErrorResponse(ERRORS.CHANNEL_MEMBER_NOT_DELETED);

    return pool.query("UPDATE channel_members SET deleted_at = NULL WHERE id = ?", [request.params.id]);
}