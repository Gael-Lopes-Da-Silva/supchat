import pool from "../database/db.js";
import { ERRORS, createErrorResponse } from "../app/ErrorHandler.js";

export const createWorkspaceMember = async (request) => {
    if (!request.body.user_id) return createErrorResponse({ code: 400, message: "USER_ID_NOT_PROVIDED" });
    if (!request.body.workspace_id) return createErrorResponse({ code: 400, message: "WORKSPACE_ID_NOT_PROVIDED" });
    if (!request.body.role_id) return createErrorResponse({ code: 400, message: "ROLE_ID_NOT_PROVIDED" });

    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.body.user_id]);
    if (!user || user.length === 0) return createErrorResponse({ code: 404, message: "USER_NOT_FOUND" });
    if (user.deleted_at !== null) return createErrorResponse({ code: 400, message: "USER_DELETED" });

    const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.body.workspace_id]);
    if (!workspace || workspace.length === 0) return createErrorResponse({ code: 404, message: "WORKSPACE_NOT_FOUND" });
    if (workspace.deleted_at !== null) return createErrorResponse({ code: 400, message: "WORKSPACE_DELETED" });

    const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [request.body.role_id]);
    if (!role || role.length === 0) return createErrorResponse({ code: 404, message: "ROLE_NOT_FOUND" });

    const [existingMember] = await pool.query(
        "SELECT * FROM workspace_members WHERE user_id = ? AND workspace_id = ?",
        [request.body.user_id, request.body.workspace_id]
    );
    if (existingMember && existingMember.length > 0) {
        return createErrorResponse({ code: 409, message: "USER_ALREADY_EXISTS_IN_WORKSPACE" });
    }

    await pool.query(
        "INSERT INTO workspace_members (workspace_id, user_id, role_id) VALUES (?, ?, ?)",
        [request.body.workspace_id, request.body.user_id, request.body.role_id]
    );

    return { success: true };
};


export const readWorkspaceMember = async (request) => {
    if (request.params.id) {
        const [workspaceMember] = await pool.query("SELECT * FROM workspace_members WHERE id = ?", [request.params.id]);
        if (!workspaceMember) return createErrorResponse(ERRORS.WORKSPACE_MEMBER_NOT_FOUND);
        return workspaceMember;
    } else {
        let query = "SELECT * FROM workspace_members"
        let where = [];
        let params = [];

        if (request.query.workspace_id) {
            const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.query.workspace_id]);
            if (!workspace) return createErrorResponse(ERRORS.WORKSPACE_NOT_FOUND);
            where.push("workspace_id = ?");
            params.push(request.query.workspace_id);
        }

        if (request.query.user_id) {
            const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.query.user_id]);
            if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
            where.push("user_id = ?");
            params.push(request.query.user_id);
        }

        if (request.query.role_id) {
            const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [request.query.role_id]);
            if (!role) return createErrorResponse(ERRORS.ROLE_NOT_FOUND);
            where.push("role_id = ?");
            params.push(request.query.role_id);
        }

        if (where.length > 0) {
            query += " WHERE " + where.join(" AND ");
        }

        return pool.query(query, params);
    }
};

export const updateWorkspaceMember = async (request) => {
    if (!request.params.id) return createErrorResponse(ERRORS.ID_NOT_PROVIDED);

    const [workspaceMember] = await pool.query("SELECT * FROM workspace_members WHERE id = ?", [request.params.id]);
    if (!workspaceMember) return createErrorResponse(ERRORS.WORKSPACE_MEMBER_NOT_FOUND);
    if (workspaceMember.deleted_at !== null) return createErrorResponse(ERRORS.WORKSPACE_MEMBER_DELETED);

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

    if (request.body.role_id) {
        const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [request.body.role_id]);
        if (!role) return createErrorResponse(ERRORS.ROLE_NOT_FOUND);
    }

    if (await pool.query("SELECT * FROM workspace_members WHERE user_id = ? AND workspace_id = ?", [
        request.body.user_id,
        request.body.workspace_id
    ])) return createErrorResponse(ERRORS.USER_ALREADY_EXISTS_IN_WORKSPACE);

    return pool.query("UPDATE workspace_members SET workspace_id = ?, user_id = ?, role_id = ? WHERE id = ?", [
        request.body.workspace_id || workspaceMember.workspace_id,
        request.body.user_id || workspaceMember.user_id,
        request.body.role_id || workspaceMember.role_id,
        request.params.id
    ]);
};

export const deleteWorkspaceMember = async (request) => {
    if (!request.params.id) return createErrorResponse(ERRORS.ID_NOT_PROVIDED);

    const [workspaceMember] = await pool.query("SELECT * FROM workspace_members WHERE id = ?", [request.params.id]);
    if (!workspaceMember) return createErrorResponse(ERRORS.WORKSPACE_MEMBER_NOT_FOUND);
    if (workspaceMember.deleted_at !== null) return createErrorResponse(ERRORS.WORKSPACE_MEMBER_ALREADY_DELETED);

    return pool.query("UPDATE workspace_members SET deleted_at = NOW() WHERE id = ?", [request.params.id]);
};

export const restoreWorkspaceMember = async (request) => {
    if (!request.params.id) return createErrorResponse(ERRORS.ID_NOT_PROVIDED);

    const [workspaceMember] = await pool.query("SELECT * FROM workspace_members WHERE id = ?", [request.params.id]);
    if (!workspaceMember) return createErrorResponse(ERRORS.WORKSPACE_MEMBER_NOT_FOUND);
    if (workspaceMember.deleted_at === null) return createErrorResponse(ERRORS.WORKSPACE_MEMBER_NOT_DELETED);

    return pool.query("UPDATE workspace_members SET deleted_at = NULL WHERE id = ?", [request.params.id]);
};