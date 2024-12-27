import pool from "../database/db.js";

export const createChannelPermission = async (request) => {
    if (!request.body.user_id) return {
        error: 1,
        error_message: "User_id not provided"
    };

    if (!request.body.channel_id) return {
        error: 1,
        error_message: "Channel_id not provided"
    };

    if (!request.body.permission_id) return {
        error: 1,
        error_message: "Permission_id not provided"
    };

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

    if (request.body.permission_id) {
        const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [
            request.body.permission_id
        ]);

        if (!permission) return {
            error: 1,
            error_message: "Permission not found"
        };
    }

    return pool.query("INSERT INTO channel_permissions (user_id, channel_id, permission_id) VALUES (?, ?, ?)", [
        request.body.user_id,
        request.body.channel_id,
        request.body.permission_id
    ]);
}

export const readChannelPermission = async (request) => {
    if (request.params.user_id && request.params.channel_id && request.params.permission_id) {
        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
            request.params.user_id
        ]);

        if (!user) return {
            error: 1,
            error_message: "User not found"
        };

        if (user.deleted_at != null) return {
            error: 1,
            error_message: "User deleted"
        };

        const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [
            request.params.channel_id
        ]);

        if (!channel) return {
            error: 1,
            error_message: "Channel not found"
        };

        if (channel.deleted_at != null) return {
            error: 1,
            error_message: "Channel deleted"
        };

        const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [
            request.params.permission_id
        ]);

        if (!permission) return {
            error: 1,
            error_message: "Permission not found"
        };

        const [channelPermission] = await pool.query("SELECT * FROM channel_permissions WHERE user_id = ? AND channel_id = ? AND permission_id = ?", [
            request.params.user_id,
            request.params.channel_id,
            request.params.permission_id
        ]);

        if (!channelPermission) return {
            error: 1,
            error_message: "Channel permission not found"
        };

        return channelPermission;
    } else {
        let query = "SELECT * FROM channel_permissions"
        let where = [];
        let params = [];

        if (request.query.user_id) {
            const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
                request.query.user_id
            ]);

            if (!user) return {
                error: 1,
                error_message: "User not found"
            };

            if (user.deleted_at != null) return {
                error: 1,
                error_message: "User deleted"
            };

            where.push("user_id = ?");
            params.push(request.query.user_id);
        }

        if (request.query.channel_id) {
            const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [
                request.query.channel_id
            ]);

            if (!channel) return {
                error: 1,
                error_message: "Channel not found"
            };

            if (channel.deleted_at != null) return {
                error: 1,
                error_message: "Channel deleted"
            };

            where.push("channel_id = ?");
            params.push(request.query.channel_id);
        }

        if (request.query.permission_id) {
            const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [
                request.query.permission_id
            ]);

            if (!permission) return {
                error: 1,
                error_message: "Permission not found"
            };

            where.push("permission_id = ?");
            params.push(request.query.permission_id);
        }

        if (where > 0) {
            query += " WHERE " + where.join(" AND ");
        }

        return pool.query(query, params);
    }
}

export const deleteChannelPermission = async (request) => {
    if (!request.params.user_id) return {
        error: 1,
        error_message: "User_id not provided"
    };

    if (!request.params.channel_id) return {
        error: 1,
        error_message: "Channel_id not provided"
    };

    if (!request.params.permission_id) return {
        error: 1,
        error_message: "Permission_id not provided"
    };

    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
        request.params.user_id
    ]);

    if (!user) return {
        error: 1,
        error_message: "User not found"
    };

    if (user.deleted_at != null) return {
        error: 1,
        error_message: "User deleted"
    };

    const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [
        request.params.channel_id
    ]);

    if (!channel) return {
        error: 1,
        error_message: "Channel not found"
    };

    if (channel.deleted_at != null) return {
        error: 1,
        error_message: "Channel deleted"
    };

    const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [
        request.params.permission_id
    ]);

    if (!permission) return {
        error: 1,
        error_message: "Permission not found"
    };

    return pool.query("DELETE FROM channel_permissions WHERE user_id = ? AND channel_id = ? AND permission_id = ?", [
        request.params.user_id,
        request.params.channel_id,
        request.params.permission_id
    ]);
}