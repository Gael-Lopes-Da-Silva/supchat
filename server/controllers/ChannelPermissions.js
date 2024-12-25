import pool from "../database/db.js";

// --------------------
// Create
// --------------------

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

        if (!user.length) return {
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

        if (!channel.length) return {
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

        if (!permission.length) return {
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

// --------------------
// Read
// --------------------

export const readChannelPermission = async (request) => {
    let query = "SELECT * FROM channel_permissions"
    let where = [];
    let params = [];

    if (request.body.user_id) {
        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
            request.body.user_id
        ]);

        if (!user.length) return {
            error: 1,
            error_message: "User not found"
        };
        
        if (user.deleted_at != null) return {
            error: 1,
            error_message: "User deleted"
        };

        where.push("user_id = ?");
        params.push(request.body.user_id);
    }
    
    if (request.body.channel_id) {
        const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [
            request.body.channel_id
        ]);

        if (!channel.length) return {
            error: 1,
            error_message: "Channel not found"
        };
        
        if (channel.deleted_at != null) return {
            error: 1,
            error_message: "Channel deleted"
        };

        where.push("channel_id = ?");
        params.push(request.body.channel_id);
    }
    
    if (request.body.permission_id) {
        const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [
            request.body.permission_id
        ]);

        if (!permission.length) {
            return {
                error: 1,
                error_message: "Permission not found"
            };
        };

        where.push("permission_id = ?");
        params.push(request.body.permission_id);
    }

    if (where.length > 0) {
        query += " WHERE " + where.join(" AND ");
    }

    return pool.query(query, params);
}

// --------------------
// Update
// --------------------

// Use Add and Delete to update

// --------------------
// Delete
// --------------------

export const deleteChannelPermission = async (request) => {
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

        if (!user.length) return {
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

        if (!channel.length) return {
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

        if (!permission.length) return {
            error: 1,
            error_message: "Permission not found"
        };
    }

    return pool.query("DELETE FROM channel_permissions WHERE user_id = ? AND channel_id = ? AND permission_id = ?", [
        request.body.user_id,
        request.body.channel_id,
        request.body.permission_id
    ]);
}