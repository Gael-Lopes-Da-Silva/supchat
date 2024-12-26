import pool from "../database/db.js";

// --------------------
// Create
// --------------------

export const createWorkspaceMember = async (request) => {
    if (!request.body.user_id) return {
        error: 1,
        error_message: "User_id not provided"
    };

    if (!request.body.workspace_id) return {
        error: 1,
        error_message: "Workspace_id not provided"
    };

    if (!request.body.role_id) return {
        error: 1,
        error_message: "Role_id not provided"
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

    const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [
        request.body.role_id
    ]);

    if (!role) return {
        error: 1,
        error_message: "Role not found"
    };

    return pool.query("INSERT INTO workspace_members (workspace_id, user_id, role_id) VALUES (?, ?, ?)", [
        request.body.workspace_id,
        request.body.user_id,
        request.body.role_id
    ]);
};

// --------------------
// Read
// --------------------

export const readWorkspaceMember = async (request) => {
    let query = "SELECT * FROM workspace_members"
    let where = [];
    let params = [];

    if (request.body.id) {
        const [workspaceMember] = await pool.query("SELECT * FROM workspace_members WHERE id = ?", [
            request.body.id
        ]);

        if (!workspaceMember) return {
            error: 1,
            error_message: "Workspace member not found"
        };

        where.push("id = ?");
        params.push(request.body.id);
    }

    if (request.body.workspace_id) {
        const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [
            request.body.workspace_id
        ]);

        if (!workspace) return {
            error: 1,
            error_message: "Workspace not found"
        };

        where.push("workspace_id = ?");
        params.push(request.body.workspace_id);
    }

    if (request.body.user_id) {
        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
            request.body.user_id
        ]);

        if (!user) return {
            error: 1,
            error_message: "User not found"
        };

        where.push("user_id = ?");
        params.push(request.body.user_id);
    }

    if (request.body.role_id) {
        const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [
            request.body.role_id
        ]);

        if (!role) return {
            error: 1,
            error_message: "Role not found"
        };

        where.push("role_id = ?");
        params.push(request.body.role_id);
    }

    if (where > 0) {
        query += " WHERE " + where.join(" AND ");
    }

    return pool.query(query, params);
};

// --------------------
// Update
// --------------------

export const updateWorkspaceMember = async (request) => {
    if (!request.body.id) return {
        error: 1,
        error_message: "Id not provided"
    };

    const [workspaceMember] = await pool.query("SELECT * FROM workspace_members WHERE id = ?", [
        request.body.id
    ]);

    if (!workspaceMember) return {
        error: 1,
        error_message: "Workspace member not found"
    };
    
    if (workspaceMember.deleted_at != null) return {
        error: 1,
        error_message: "Workspace member deleted"
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

    if (request.body.role_id) {
        const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [
            request.body.role_id
        ]);

        if (!role) return {
            error: 1,
            error_message: "Role not found"
        };
    }

    return pool.query("UPDATE workspace_members SET workspace_id = ?, user_id = ?, role_id = ? WHERE id = ?", [
        request.body.workspace_id || workspaceMember.workspace_id,
        request.body.user_id || workspaceMember.user_id,
        request.body.role_id || workspaceMember.role_id,
        request.body.id
    ]);
};

// --------------------
// Delete
// --------------------

export const deleteWorkspaceMember = async (request) => {
    if (!request.body.id) return {
        error: 1,
        error_message: "Id not provided"
    };

    const [workspaceMember] = await pool.query("SELECT * FROM workspace_members WHERE id = ?", [
        request.body.id
    ]);

    if (!workspaceMember) return {
        error: 1,
        error_message: "Workspace member not found"
    };
    
    if (workspaceMember.deleted_at != null) return {
        error: 1,
        error_message: "Workspace member already deleted"
    };

    return pool.query("UPDATE workspace_members SET deleted_at = NOW() WHERE id = ?", [
        request.body.id
    ]);
};

export const restoreWorkspaceMember = async (request) => {
    if (!request.body.id) return {
        error: 1,
        error_message: "Id not provided"
    };

    const [workspaceMember] = await pool.query("SELECT * FROM workspace_members WHERE id = ?", [
        request.body.id
    ]);

    if (!workspaceMember) return {
        error: 1,
        error_message: "Workspace member not found"
    };
    
    if (workspaceMember.deleted_at == null) return {
        error: 1,
        error_message: "Workspace member not deleted"
    };

    return pool.query("UPDATE workspace_members SET deleted_at = NULL WHERE id = ?", [
        request.body.id
    ]);
};