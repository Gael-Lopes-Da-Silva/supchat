import pool from "../database/db.js";

export const createChannel = async (request) => {
    if (!request.body.user_id) return {
        error: 1,
        error_message: "User_id not provided"
    };

    if (!request.body.workspace_id) return {
        error: 1,
        error_message: "Workspace_id not provided"
    };

    if (!request.body.name) return {
        error: 1,
        error_message: "Name not provided"
    };

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

    const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [
        request.body.workspace_id
    ]);

    if (!workspace) return {
        error: 1,
        error_message: "Workspace not found"
    };

    if (workspace.deleted_at != null) return {
        error: 1,
        error_message: "Workspace deleted"
    };
    
    if (request.body.is_private && request.body.is_private != "true" && request.body.is_private != "false") return {
        error: 1,
        error_message: "Is_private should be a boolean"
    };

    return pool.query("INSERT INTO channels (workspace_id, name, is_private, user_id) VALUES (?, ?, ?, ?, ?)", [
        request.body.workspace_id,
        request.body.name,
        request.body.is_private ? request.body.is_private === "true" : false,
        request.body.user_id
    ]);
}

export const readChannel = async (request) => {
    if (request.params.id) {
        const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [
            request.body.id
        ]);

        if (!channel) return {
            error: 1,
            error_message: "Channel not found"
        };

        return channel;
    } else {
        let query = "SELECT * FROM channels"
        let where = [];
        let params = [];

        if (request.query.workspace_id) {
            const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [
                request.query.workspace_id
            ]);

            if (!workspace) return {
                error: 1,
                error_message: "Workspace not found"
            };

            where.push("workspace_id = ?");
            params.push(request.query.workspace_id);
        }

        if (request.query.name) {
            where.push("name = ?");
            params.push(request.query.name);
        }

        if (request.query.is_private) {
            if (request.query.is_private != "true" && request.query.is_private != "false") return {
                error: 1,
                error_message: "Is_private should be a boolean"
            };

            where.push("is_private = ?");
            params.push(request.query.is_private);
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

        if (where.length > 0) {
            query += " WHERE " + where.join(" AND ");
        }

        return pool.query(query, params);
    }
}

export const updateChannel = async (request) => {
    if (!request.params.id) return {
        error: 1,
        error_message: "Id not provided"
    };

    const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [
        request.params.id
    ]);

    if (!channel) return {
        error: 1,
        error_message: "Channel not found"
    };

    if (channel.deleted_at != null) return {
        error: 1,
        error_message: "Channel deleted"
    };

    if (request.body.workspace_id) {
        const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [
            request.body.workspace_id
        ]);

        if (!workspace) return {
            error: 1,
            error_message: "Workspace not found"
        };

        if (workspace.deleted_at != null) return {
            error: 1,
            error_message: "Workspace deleted"
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
    
    if (request.body.is_private && request.body.is_private != "true" && request.body.is_private != "false") return {
        error: 1,
        error_message: "Is_private should be a boolean"
    };

    return pool.query("UPDATE channels SET workspace_id = ?, name = ?, is_private = ?, role = ?, user_id = ?, updated_at = NOW() WHERE id = ?", [
        request.body.workspace_id || channel.workspace_id,
        request.body.name || channel.name,
        request.body.is_private ? request.body.is_private === "true" : channel.is_private,
        request.body.user_id || channel.user_id,
        request.params.id
    ]);
}

export const deleteChannel = async (request) => {
    if (!request.params.id) return {
        error: 1,
        error_message: "Id not provided"
    };

    const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [
        request.params.id
    ]);

    if (!channel) return {
        error: 1,
        error_message: "Channel not found"
    };

    if (channel.deleted_at != null) return {
        error: 1,
        error_message: "Channel already deleted"
    };

    return pool.query("UPDATE channels SET deleted_at = NOW() WHERE id = ?", [
        request.params.id
    ]);
}

export const restoreChannel = async (request) => {
    if (!request.params.id) return {
        error: 1,
        error_message: "Id not provided"
    };

    const [channel] = await pool.query("SELECT * FROM channels WHERE id = ?", [
        request.params.id
    ]);

    if (!channel) return {
        error: 1,
        error_message: "Channel not found"
    };

    if (channel.deleted_at == null) return {
        error: 1,
        error_message: "Channel not deleted"
    };

    return pool.query("UPDATE channels SET deleted_at = NULL WHERE id = ?", [
        request.params.id
    ]);
}