import pool from "../database/db.js";
import { ERRORS, createErrorResponse } from "../app/ErrorHandler.js";

export const createRolePermission = async (request) => {
    if (!request.body.role_id) return createErrorResponse(ERRORS.ROLE_ID_NOT_PROVIDED);
    if (!request.body.permission_id) return createErrorResponse(ERRORS.PERMISSION_ID_NOT_PROVIDED);

    if (request.body.role_id) {
        const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [request.body.role_id]);
        if (!role) return createErrorResponse(ERRORS.ROLE_NOT_FOUND);
    }

    if (request.body.permission_id) {
        const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [request.body.permission_id]);
        if (!permission) return createErrorResponse(ERRORS.PERMISSION_NOT_FOUND);
    }

    return pool.query("INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)", [
        request.body.role_id,
        request.body.permission_id
    ]);
}

export const readRolePermission = async (request) => {
    if (request.params.role_id && request.params.permission_id) {
        const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [request.params.role_id]);
        if (!role) return createErrorResponse(ERRORS.ROLE_NOT_FOUND);

        const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [request.params.permission_id]);
        if (!permission) return createErrorResponse(ERRORS.PERMISSION_NOT_FOUND);
        
        return pool.query("SELECT * FROM role_permissions WHERE role_id = ? AND permission_id = ?", [
            request.params.role_id,
            request.params.permission_id
        ]);
    } else {
        let query = "SELECT * FROM role_permissions"
        let where = [];
        let params = [];

        if (request.query.role_id) {
            const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [request.query.role_id]);
            if (!role) return createErrorResponse(ERRORS.ROLE_NOT_FOUND);
            where.push("role_id = ?");
            params.push(request.query.role_id);
        }

        if (request.query.permission_id) {
            const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [request.query.permission_id]);
            if (!permission) return createErrorResponse(ERRORS.PERMISSION_NOT_FOUND);
            where.push("permission_id = ?");
            params.push(request.query.permission_id);
        }

        if (where.length > 0) {
            query += " WHERE " + where.join(" AND ");
        }

        return pool.query(query, params);
    }
}

export const deleteRolePermission = async (request) => {
    if (!request.params.role_id) return createErrorResponse(ERRORS.ROLE_ID_NOT_PROVIDED);
    if (!request.params.permission_id) return createErrorResponse(ERRORS.PERMISSION_ID_NOT_PROVIDED);

    const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [request.params.role_id]);
    if (!role) return createErrorResponse(ERRORS.ROLE_NOT_FOUND);

    const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [request.params.permission_id]);
    if (!permission) return createErrorResponse(ERRORS.PERMISSION_NOT_FOUND);

    return pool.query("DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?", [
        request.params.role_id,
        request.params.permission_id
    ]);
}