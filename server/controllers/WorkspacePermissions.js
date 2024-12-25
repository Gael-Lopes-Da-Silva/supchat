import pool from "../database/db.js";

// --------------------
// Create
// --------------------

export const createWorkspacePermission = async (request) => {
    if (!request.body.user_id) return {
        error: 1,
        error_message: "User_id not provided"
    };
    
    if (!request.body.workspace_id) return {
        error: 1,
        error_message: "Workspace_id not provided"
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
    
    if (request.body.permission_id) {
        const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [
            request.body.permission_id
        ]);

        if (!permission) return {
            error: 1,
            error_message: "Permission not found"
        };
    }

    return pool.query("INSERT INTO workspace_permissions (user_id, workspace_id, permission_id) VALUES (?, ?, ?)", [
        request.body.user_id,
        request.body.workspace_id,
        request.body.permission_id
    ]);
}

// --------------------
// Read
// --------------------

export const readWorkspacePermission = async (request) => {
    let query = "SELECT * FROM channel_permissions"
    let where = [];
    let params = [];

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

        where.push("user_id = ?");
        params.push(request.body.user_id);
    }
    
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

        where.push("workspace_id = ?");
        params.push(request.body.workspace_id);
    }
    
    if (request.body.permission_id) {
        const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [
            request.body.permission_id
        ]);

        if (!permission) {
            return {
                error: 1,
                error_message: "Permission not found"
            };
        };

        where.push("permission_id = ?");
        params.push(request.body.permission_id);
    }

    if (where > 0) {
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

export const deleteWorkspacePermission = async (request) => {
    if (!request.body.user_id) return {
        error: 1,
        error_message: "User_id not provided"
    };
    
    if (!request.body.workspace_id) return {
        error: 1,
        error_message: "Workspace_id not provided"
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
    
    if (request.body.permission_id) {
        const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [
            request.body.permission_id
        ]);

        if (!permission) return {
            error: 1,
            error_message: "Permission not found"
        };
    }

    return pool.query("DELETE FROM workspace_permissions WHERE user_id = ? AND workspace_id = ? AND permission_id = ?", [
        request.body.user_id,
        request.body.workspace_id,
        request.body.permission_id
    ]);
}