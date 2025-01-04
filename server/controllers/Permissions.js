import pool from "../database/db.js";
import { ERROR_CODES, createErrorResponse } from "./ErrorHandler/Errors.js";

export const readPermission = async (request) => {
    if (request.params.id) {
        const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [request.body.id]);
        if (!permission) return createErrorResponse(ERROR_CODES.PERMISSION_NOT_FOUND);
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