import pool from "../database/db.js";
import { ERROR_CODES, createErrorResponse } from "./ErrorHandler/Errors.js";

export const createWorkspacePermission = async (request) => {
    if (!request.body.user_id) return createErrorResponse(ERROR_CODES.USER_ID_NOT_PROVIDED);
    if (!request.body.workspace_id) return createErrorResponse(ERROR_CODES.WORKSPACE_ID_NOT_PROVIDED);
    if (!request.body.permission_id) return createErrorResponse(ERROR_CODES.PERMISSION_ID_NOT_PROVIDED);

    if (request.body.user_id) {
        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.body.user_id]);
        if (!user) return createErrorResponse(ERROR_CODES.USER_NOT_FOUND);
        if (user.deleted_at !== null) return createErrorResponse(ERROR_CODES.USER_DELETED);
    }

    if (request.body.workspace_id) {
        const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.body.workspace_id]);
        if (!workspace) return createErrorResponse(ERROR_CODES.WORKSPACE_NOT_FOUND);
        if (workspace.deleted_at !== null) return createErrorResponse(ERROR_CODES.WORKSPACE_DELETED);
    }

    if (request.body.permission_id) {
        const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [request.body.permission_id]);
        if (!permission) return createErrorResponse(ERROR_CODES.PERMISSION_NOT_FOUND);
    }

    return pool.query("INSERT INTO workspace_permissions (user_id, workspace_id, permission_id) VALUES (?, ?, ?)", [
        request.body.user_id,
        request.body.workspace_id,
        request.body.permission_id
    ]);
}

export const readWorkspacePermission = async (request) => {
    if (request.params.user_id && request.params.workspace_id && request.params.permission_id) {
        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.params.user_id]);
        if (!user) return createErrorResponse(ERROR_CODES.USER_NOT_FOUND);
        if (user.deleted_at !== null) return createErrorResponse(ERROR_CODES.USER_DELETED);

        const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.params.workspace_id]);
        if (!workspace) return createErrorResponse(ERROR_CODES.WORKSPACE_NOT_FOUND);
        if (workspace.deleted_at !== null) return createErrorResponse(ERROR_CODES.WORKSPACE_DELETED);

        const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [request.params.permission_id]);
        if (!permission) return createErrorResponse(ERROR_CODES.PERMISSION_NOT_FOUND);

        const [workspacePermission] = await pool.query("SELECT * FROM workspace_permissions WHERE user_id = ? AND workspace_id = ? AND permission_id = ?", [
            request.params.user_id,
            request.params.workspace_id,
            request.params.permission_id
        ]);
        if (!workspacePermission) return createErrorResponse(ERROR_CODES.WORKSPACE_PERMISSION_NOT_FOUND);

        return workspacePermission;
    } else {
        let query = "SELECT * FROM channel_permissions"
        let where = [];
        let params = [];

        if (request.query.user_id) {
            const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.query.user_id]);
            if (!user) return createErrorResponse(ERROR_CODES.USER_NOT_FOUND);
            if (user.deleted_at !== null) return createErrorResponse(ERROR_CODES.USER_DELETED);
            where.push("user_id = ?");
            params.push(request.query.user_id);
        }

        if (request.query.workspace_id) {
            const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.query.workspace_id]);
            if (!workspace) return createErrorResponse(ERROR_CODES.WORKSPACE_NOT_FOUND);
            if (workspace.deleted_at !== null) return createErrorResponse(ERROR_CODES.WORKSPACE_DELETED);
            where.push("workspace_id = ?");
            params.push(request.query.workspace_id);
        }

        if (request.query.permission_id) {
            const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [request.query.permission_id]);
            if (!permission) return createErrorResponse(ERROR_CODES.PERMISSION_NOT_FOUND);
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
    if (!request.params.user_id) return createErrorResponse(ERROR_CODES.USER_ID_NOT_PROVIDED);
    if (!request.params.workspace_id) return createErrorResponse(ERROR_CODES.WORKSPACE_ID_NOT_PROVIDED);
    if (!request.params.permission_id) return createErrorResponse(ERROR_CODES.PERMISSION_ID_NOT_PROVIDED);

    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.params.user_id]);
    if (!user) return createErrorResponse(ERROR_CODES.USER_NOT_FOUND);
    if (user.deleted_at !== null) return createErrorResponse(ERROR_CODES.USER_DELETED);

    const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.params.workspace_id]);
    if (!workspace) return createErrorResponse(ERROR_CODES.WORKSPACE_NOT_FOUND);
    if (workspace.deleted_at !== null) return createErrorResponse(ERROR_CODES.WORKSPACE_DELETED);

    const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [request.params.permission_id]);
    if (!permission) return createErrorResponse(ERROR_CODES.PERMISSION_NOT_FOUND);

    return pool.query("DELETE FROM workspace_permissions WHERE user_id = ? AND workspace_id = ? AND permission_id = ?", [
        request.params.user_id,
        request.params.workspace_id,
        request.params.permission_id
    ]);
}