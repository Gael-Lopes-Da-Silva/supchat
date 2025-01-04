import pool from "../database/db.js";
import { ERROR_CODES, createErrorResponse } from "./ErrorHandler/Errors.js";

export const createWorkspace = async (request) => {
    if (!request.body.name) return createErrorResponse(ERROR_CODES.NAME_NOT_PROVIDED);
    if (!request.body.description) return createErrorResponse(ERROR_CODES.DESCRIPTION_NOT_PROVIDED);
    if (!request.body.is_private) return createErrorResponse(ERROR_CODES.IS_PRIVATE_NOT_PROVIDED);
    if (!request.body.user_id) return createErrorResponse(ERROR_CODES.USER_ID_NOT_PROVIDED);

    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.body.user_id]);
    if (!user) return createErrorResponse(ERROR_CODES.USER_NOT_FOUND);

    if (user.deleted_at !== null) return createErrorResponse(ERROR_CODES.USER_DELETED);

    if (request.body.is_private && request.body.is_private !== "true" && request.body.is_private !== "false") return createErrorResponse(ERROR_CODES.IS_PRIVATE_INVALID);

    return pool.query("INSERT INTO workspaces (name, description, is_private, user_id) VALUES (?, ?, ?, ?)", [
        request.body.name,
        request.body.description || "",
        request.body.is_private ? request.body.is_private === "true" : false,
        request.body.user_id
    ]);
};

export const readWorkspace = async (request) => {
    if (request.params.id) {
        const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.params.id]);
        if (!workspace) return createErrorResponse(ERROR_CODES.WORKSPACE_NOT_FOUND);
        return workspace;
    } else {
        let query = "SELECT * FROM workspaces"
        let where = [];
        let params = [];

        if (request.query.name) {
            where.push("name = ?");
            params.push(request.query.name);
        }

        if (request.query.description) {
            where.push("description = ?");
            params.push(request.query.description);
        }

        if (request.query.is_private) {
            if (request.query.is_private !== "true" && request.query.is_private !== "false") return createErrorResponse(ERROR_CODES.IS_PRIVATE_INVALID);
            where.push("is_private = ?");
            params.push(request.query.is_private === "true");
        }

        if (request.query.user_id) {
            const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.query.user_id]);
            if (!user) return createErrorResponse(ERROR_CODES.USER_NOT_FOUND);
            where.push("user_id = ?");
            params.push(request.query.user_id);
        }

        if (where.length > 0) {
            query += " WHERE " + where.join(" AND ");
        }

        return pool.query(query, params);
    }
};

export const updateWorkspace = async (request) => {
    if (!request.params.id) return createErrorResponse(ERROR_CODES.ID_NOT_PROVIDED);

    const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.params.id]);
    if (!workspace) return createErrorResponse(ERROR_CODES.WORKSPACE_NOT_FOUND);
    if (workspace.deleted_at !== null) return createErrorResponse(ERROR_CODES.WORKSPACE_DELETED);

    if (request.body.user_id) {
        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.body.user_id]);
        if (!user) return createErrorResponse(ERROR_CODES.USER_NOT_FOUND);
        if (user.deleted_at !== null) return createErrorResponse(ERROR_CODES.USER_DELETED);
    }

    if (request.body.is_private && request.body.is_private !== "true" && request.body.is_private !== "false") return createErrorResponse(ERROR_CODES.IS_PRIVATE_INVALID);

    return pool.query("UPDATE workspaces SET name = ?, description = ?, is_private = ?, user_id = ?, updated_at = NOW() WHERE id = ?", [
        request.body.name || workspace.name,
        request.body.description || workspace.description,
        request.body.is_private ? request.body.is_private === "true" : workspace.is_private,
        request.body.user_id || workspace.user_id,
        request.params.id
    ]);
};

export const deleteWorkspace = async (request) => {
    if (!request.params.id) return createErrorResponse(ERROR_CODES.ID_NOT_PROVIDED);

    const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.params.id]);
    if (!workspace) return createErrorResponse(ERROR_CODES.WORKSPACE_NOT_FOUND);
    if (workspace.deleted_at !== null) return createErrorResponse(ERROR_CODES.WORKSPACE_ALREADY_DELETED);

    return pool.query("UPDATE workspaces SET deleted_at = NOW() WHERE id = ?", [request.params.id]);
};

export const restoreWorkspace = async (request) => {
    if (!request.params.id) return createErrorResponse(ERROR_CODES.ID_NOT_PROVIDED);

    const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.params.id]);
    if (!workspace) return createErrorResponse(ERROR_CODES.WORKSPACE_NOT_FOUND);
    if (workspace.deleted_at === null) return createErrorResponse(ERROR_CODES.WORKSPACE_NOT_DELETED);

    return pool.query("UPDATE workspaces SET deleted_at = NULL WHERE id = ?", [request.params.id]);
};