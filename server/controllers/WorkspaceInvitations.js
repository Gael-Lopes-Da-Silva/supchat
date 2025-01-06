import pool from "../database/db.js";
import { ERRORS, createErrorResponse } from "../app/ErrorHandler.js";

export const createWorkspaceInvitation = async (request) => {
    if (!request.body.user_id) return createErrorResponse(ERRORS.USER_ID_NOT_PROVIDED);
    if (!request.body.workspace_id) return createErrorResponse(ERRORS.WORKSPACE_ID_NOT_PROVIDED);
    if (!request.body.token) return createErrorResponse(ERRORS.TOKEN_NOT_PROVIDED);

    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.body.user_id]);
    if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
    if (user.deleted_at !== null) return createErrorResponse(ERRORS.USER_DELETED);

    const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.body.workspace_id]);
    if (!workspace) return createErrorResponse(ERRORS.WORKSPACE_NOT_FOUND);
    if (workspace.deleted_at !== null) return createErrorResponse(ERRORS.WORKSPACE_DELETED);

    const [token] = await pool.query("SELECT * FROM workspace_invitations WHERE token = ?", [request.body.token]);
    if (token) return createErrorResponse(ERRORS.TOKEN_NOT_UNIQUE);

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
        const [workspaceInvitation] = await pool.query("SELECT * FROM workspace_invitations WHERE id = ?", [request.body.id]);
        if (!workspaceInvitation) return createErrorResponse(ERRORS.WORKSPACE_INVITATION_NOT_FOUND);
        return workspaceInvitation;
    } else {
        let query = "SELECT * FROM workspace_invitations"
        let where = [];
        let params = [];

        if (request.query.user_id) {
            const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.query.user_id]);
            if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
            where.push("user_id = ?");
            params.push(request.query.user_id);
        }

        if (request.query.workspace_id) {
            const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.query.workspace_id]);
            if (!workspace) return createErrorResponse(ERRORS.WORKSPACE_NOT_FOUND);
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

        if (where.length > 0) {
            query += " WHERE " + where.join(" AND ");
        }

        return pool.query(query, params);
    }
};

export const updateWorkspaceInvitation = async (request) => {
    if (!request.params.id) return createErrorResponse(ERRORS.ID_NOT_PROVIDED);

    const [workspaceInvitation] = await pool.query("SELECT * FROM workspace_invitations WHERE id = ?", [request.params.id]);
    if (!workspaceInvitation) return createErrorResponse(ERRORS.WORKSPACE_INVITATION_NOT_FOUND);
    if (workspaceInvitation.deleted_at !== null) return createErrorResponse(ERRORS.WORKSPACE_INVITATION_DELETED);

    if (request.body.user_id) {
        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.body.user_id]);
        if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
        if (user.deleted_at !== null) return createErrorResponse(ERRORS.USER_DELETED);
    }

    if (request.body.workspace_id) {
        const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.body.workspace_id]);
        if (!workspace) return createErrorResponse(ERRORS.WORKSPACE_NOT_FOUND);
        if (workspace.deleted_at !== null) return createErrorResponse(ERRORS.WORKSPACE_DELETED);
    }

    if (request.body.token) {
        const [token] = await pool.query("SELECT * FROM workspace_invitations WHERE token = ?", [request.body.token]);
        if (token) return createErrorResponse(ERRORS.TOKEN_NOT_UNIQUE);
    }

    return pool.query("UPDATE workspace_members SET user_id = ?, workspace_id = ?, token = ?, maximum_user = ?, used_by = ?, expire_at = ? WHERE id = ?", [
        request.body.user_id || workspaceInvitation.user_id,
        request.body.workspace_id || workspaceInvitation.workspace_id,
        request.body.token || workspaceInvitation.token,
        request.body.maximum_use !== undefined ? request.body.maximum_use : workspaceInvitation.maximum_use,
        request.body.used_by || workspaceInvitation.used_by,
        request.body.expire_at !== undefined ? request.body.expire_at : workspaceInvitation.expire_at,
        request.params.id
    ]);
};

export const deleteWorkspaceInvitation = async (request) => {
    if (!request.params.id) return createErrorResponse(ERRORS.ID_NOT_PROVIDED);

    const [workspaceInvitation] = await pool.query("SELECT * FROM workspace_invitations WHERE id = ?", [request.params.id]);
    if (!workspaceInvitation) return createErrorResponse(ERRORS.WORKSPACE_INVITATION_NOT_FOUND);
    if (workspaceInvitation.deleted_at !== null) return createErrorResponse(ERRORS.WORKSPACE_INVITATION_ALREADY_DELETED);

    return pool.query("UPDATE workspace_invitations SET deleted_at = NOW() WHERE id = ?", [request.params.id]);
};

export const restoreWorkspaceInvitation = async (request) => {
    if (!request.params.id) return createErrorResponse(ERRORS.ID_NOT_PROVIDED);

    const [workspaceInvitation] = await pool.query("SELECT * FROM workspace_invitations WHERE id = ?", [request.params.id]);
    if (!workspaceInvitation) return createErrorResponse(ERRORS.WORKSPACE_INVITATION_NOT_FOUND);
    if (workspaceInvitation.deleted_at === null) return createErrorResponse(ERRORS.WORKSPACE_INVITATION_NOT_DELETED);

    return pool.query("UPDATE workspace_invitations SET deleted_at = NULL WHERE id = ?", [request.params.id]);
};