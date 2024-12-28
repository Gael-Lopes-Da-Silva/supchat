import pool from "../database/db.js";

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

export const readWorkspacePermission = async (request) => {
    if (request.params.user_id && request.params.workspace_id && request.params.permission_id) {
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

        const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [
            request.params.workspace_id
        ]);

        if (!workspace) return {
            error: 1,
            error_message: "Workspace not found"
        };

        if (workspace.deleted_at != null) return {
            error: 1,
            error_message: "Workspace deleted"
        };

        const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [
            request.params.permission_id
        ]);

        if (!permission) return {
            error: 1,
            error_message: "Permission not found"
        };

        const [workspacePermission] = await pool.query("SELECT * FROM workspace_permissions WHERE user_id = ? AND workspace_id = ? AND permission_id = ?", [
            request.params.user_id,
            request.params.workspace_id,
            request.params.permission_id
        ]);

        if (!workspacePermission) return {
            error: 1,
            error_message: "Workspace permission not found"
        };

        return workspacePermission;
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

        if (request.query.workspace_id) {
            const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [
                request.query.workspace_id
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
            params.push(request.query.workspace_id);
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

        if (where.length > 0) {
            query += " WHERE " + where.join(" AND ");
        }

        return pool.query(query, params);
    }
}

export const deleteWorkspacePermission = async (request) => {
    if (!request.params.user_id) return {
        error: 1,
        error_message: "User_id not provided"
    };

    if (!request.params.workspace_id) return {
        error: 1,
        error_message: "Workspace_id not provided"
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

    const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [
        request.params.workspace_id
    ]);

    if (!workspace) return {
        error: 1,
        error_message: "Workspace not found"
    };

    if (workspace.deleted_at != null) return {
        error: 1,
        error_message: "Workspace deleted"
    };

    const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [
        request.params.permission_id
    ]);

    if (!permission) return {
        error: 1,
        error_message: "Permission not found"
    };

    return pool.query("DELETE FROM workspace_permissions WHERE user_id = ? AND workspace_id = ? AND permission_id = ?", [
        request.params.user_id,
        request.params.workspace_id,
        request.params.permission_id
    ]);
}