import pool from "../database/db.js";

export const createChannelMember = async (request) => {
    const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [
        request.body.channel_id
    ]);

    if (!channel) return {
        error: 1,
        error_message: "Channel not found"
    };

    if (channel.deleted_at != null) return {
        error: 1,
        error_message: "Channel deleted"
    };

    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
        request.body.user_id
    ]);

    if (!user) return {
        error: 1,
        error_message: "User not found"
    };

    if (channel.deleted_at != null) return {
        error: 1,
        error_message: "User deleted"
    };

    const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [
        request.body.role_id
    ]);

    if (!role) return {
        error: 1,
        error_message: "Role not found"
    };

    return pool.query("INSERT INTO channel_members (channel_id, user_id, role_id) VALUES (?, ?, ?, ?, ?)", [
        request.body.channel_id,
        request.body.user_id,
        request.body.role_id
    ]);
}

export const readChannelMember = async (request) => {
    if (request.params.id) {
        const [channelMember] = await pool.query("SELECT * FROM channel_members WHERE id = ?", [
            request.body.id
        ]);

        if (!channelMember) return {
            error: 1,
            error_message: "Channel member not found"
        };

        return channelMember;
    } else {
        let query = "SELECT * FROM channel_members"
        let where = [];
        let params = [];

        if (request.query.channel_id) {
            const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [
                request.query.channel_id
            ]);

            if (!channel) return {
                error: 1,
                error_message: "Channel not found"
            };

            where.push("channel_id = ?");
            params.push(request.query.channel_id);
        }

        if (request.query.user_id) {
            const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
                request.query.user_id
            ]);

            if (!user) return {
                error: 1,
                error_message: "User not found"
            };

            where.push("user_id = ?");
            params.push(request.query.user_id);
        }

        if (request.query.role_id) {
            const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [
                request.query.role_id
            ]);

            if (!role) return {
                error: 1,
                error_message: "Role not found"
            };

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
    if (!request.params.id) return {
        error: 1,
        error_message: "Id not provided"
    };

    const [channelMember] = await pool.query("SELECT * FROM channel_members WHERE id = ?", [
        request.params.id
    ]);

    if (!channelMember) return {
        error: 1,
        error_message: "Channel member not found"
    };

    if (channelMember.deleted_at != null) return {
        error: 1,
        error_message: "Channel member deleted"
    };

    if (request.body.channel_id) {
        const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [
            request.body.channel_id
        ]);

        if (!channel) return {
            error: 1,
            error_message: "Channel not found"
        };

        if (channel.deleted_at != null) return {
            error: 1,
            error_message: "Channel deleted"
        };
    }

    if (request.body.user_id) {
        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
            request.body.user_id
        ]);

        if (!user) return {
            error: 1,
            error_message: "User not found"
        };

        if (user.deleted_at != null) return {
            error: 1,
            error_message: "User deleted"
        };
    }

    if (request.body.role_id) {
        const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [
            request.body.role_id
        ]);

        if (!role) return {
            error: 1,
            error_message: "Role not found"
        };
    }

    return pool.query("UPDATE channel_members SET channel_id = ?, user_id = ?, role_id = ?, updated_at = NOW() WHERE id = ?", [
        request.body.channel_id || channelMember.channel_id,
        request.body.user_id || channelMember.user_id,
        request.body.role_id || channelMember.role_id,
        request.params.id
    ]);
}

export const deleteChannelMember = async (request) => {
    const [channelMember] = await pool.query("SELECT * FROM channel_members WHERE id = ?", [
        request.params.id
    ]);

    if (!channelMember) return {
        error: 1,
        error_message: "Channel member not found"
    };

    if (channelMember.deleted_at != null) return {
        error: 1,
        error_message: "Channel member already deleted"
    };

    return pool.query("UPDATE channel_members SET deleted_at = NOW() WHERE id = ?", [
        request.params.id
    ]);
}

export const restoreChannelMember = async (request) => {
    const [channelMember] = await pool.query("SELECT * FROM channel_members WHERE id = ?", [
        request.params.id
    ]);

    if (!channelMember) return {
        error: 1,
        error_message: "Channel member not found"
    };

    if (channelMember.deleted_at == null) return {
        error: 1,
        error_message: "Channel member not deleted"
    };

    return pool.query("UPDATE channel_members SET deleted_at = NULL WHERE id = ?", [
        request.params.id
    ]);
}