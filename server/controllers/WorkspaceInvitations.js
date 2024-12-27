import pool from "../database/db.js";

export const createWorkspaceInvitation = async (request) => {
    if (!request.body.user_id) return {
        error: 1,
        error_message: "User_id not provided"
    };

    if (!request.body.workspace_id) return {
        error: 1,
        error_message: "Workspace_id not provided"
    };

    if (!request.body.token) return {
        error: 1,
        error_message: "Token not provided"
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

    const [token] = await pool.query("SELECT * FROM workspace_invitations WHERE token = ?", [
        request.body.token
    ]);

    if (token) return {
        error: 1,
        error_message: "Token must be unique"
    };

    return pool.query("INSERT INTO workspace_invitations (user_id, workspace_id, token, maximum_use, used_by, expire_at) VALUES (?, ?, ?, ?, ?, ?)", [
        request.body.user_id,
        request.body.workspace_id,
        request.body.token,
        request.body.maximum_use || null,
        request.body.used_by || 0,
        request.body.expire_at || null,
    ]);
};

export const readWorkspaceInvitation = async (request) => {
    if (request.params.id) {
        const [workspaceInvitation] = await pool.query("SELECT * FROM workspace_invitations WHERE id = ?", [
            request.body.id
        ]);

        if (!workspaceInvitation) return {
            error: 1,
            error_message: "Workspace invitation not found"
        };

        return workspaceInvitation;
    } else {
        let query = "SELECT * FROM workspace_invitations"
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

            where.push("workspace_id = ?");
            params.push(request.query.workspace_id);
        }

        if (request.query.token) {
            where.push("token = ?");
            params.push(request.query.token);
        }

        if (request.query.maximum_use) {
            where.push("maximum_use = ?");
            params.push(request.query.maximum_use);
        }

        if (request.query.used_by) {
            where.push("used_by = ?");
            params.push(request.query.used_by);
        }

        if (request.query.expire_at) {
            where.push("expire_at = ?");
            params.push(request.query.expire_at);
        }

        if (where > 0) {
            query += " WHERE " + where.join(" AND ");
        }

        return pool.query(query, params);
    }
};

export const updateWorkspaceInvitation = async (request) => {
    if (!request.params.id) return {
        error: 1,
        error_message: "Id not provided"
    };

    const [workspaceInvitation] = await pool.query("SELECT * FROM workspace_invitations WHERE id = ?", [
        request.params.id
    ]);

    if (!workspaceInvitation) return {
        error: 1,
        error_message: "Workspace invitation not found"
    };

    if (workspaceInvitation.deleted_at != null) return {
        error: 1,
        error_message: "Workspace invitation deleted"
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

    if (request.body.token) {
        const [token] = await pool.query("SELECT * FROM workspace_invitations WHERE token = ?", [
            request.body.token
        ]);

        if (token) return {
            error: 1,
            error_message: "Token must be unique"
        };
    }

    return pool.query("UPDATE workspace_members SET user_id = ?, workspace_id = ?, token = ?, maximum_user = ?, used_by = ?, expire_at = ? WHERE id = ?", [
        request.body.user_id || workspaceInvitation.user_id,
        request.body.workspace_id || workspaceInvitation.workspace_id,
        request.body.token || workspaceInvitation.token,
        request.body.maximum_use || workspaceInvitation.maximum_use,
        request.body.used_by || workspaceInvitation.used_by,
        request.body.expire_at || workspaceInvitation.expire_at,
        request.params.id
    ]);
};

export const deleteWorkspaceInvitation = async (request) => {
    if (!request.params.id) return {
        error: 1,
        error_message: "Id not provided"
    };

    const [workspaceInvitation] = await pool.query("SELECT * FROM workspace_invitations WHERE id = ?", [
        request.params.id
    ]);

    if (!workspaceInvitation) return {
        error: 1,
        error_message: "Workspace invitation not found"
    };

    if (workspaceInvitation.deleted_at != null) return {
        error: 1,
        error_message: "Workspace invitation already deleted"
    };

    return pool.query("UPDATE workspace_invitations SET deleted_at = NOW() WHERE id = ?", [
        request.params.id
    ]);
};

export const restoreWorkspaceInvitation = async (request) => {
    if (!request.params.id) return {
        error: 1,
        error_message: "Id not provided"
    };

    const [workspaceInvitation] = await pool.query("SELECT * FROM workspace_invitations WHERE id = ?", [
        request.params.id
    ]);

    if (!workspaceInvitation) return {
        error: 1,
        error_message: "Workspace invitation not found"
    };

    if (workspaceInvitation.deleted_at == null) return {
        error: 1,
        error_message: "Workspace invitation not deleted"
    };

    return pool.query("UPDATE workspace_invitations SET deleted_at = NULL WHERE id = ?", [
        request.params.id
    ]);
};