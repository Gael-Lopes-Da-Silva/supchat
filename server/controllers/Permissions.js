import pool from "../database/db.js";
import { ERRORS, createErrorResponse } from "../app/ErrorHandler.js";

export const readPermission = async (request) => {
    if (request.params.id) {
        const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [request.body.id]);
        if (!permission) return createErrorResponse(ERRORS.PERMISSION_NOT_FOUND);
        return permission;
    } else {
        let query = "SELECT * FROM permissions"
        let where = [];
        let params = [];

        if (request.query.name) {
            where.push("name = ?");
            params.push(request.query.name);
        }

        if (where.length > 0) {
            query += " WHERE " + where.join(" AND ");
        }

        return pool.query(query, params);
    }
}