import pool from "../database/db.js";
import { ERROR_CODES, createErrorResponse } from "./ErrorHandler/Errors.js";

export const readRole = async (request) => {
    if (request.params.id) {
        const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [request.body.id]);
        if (!role) return createErrorResponse(ERROR_CODES.ROLE_NOT_FOUND);
        return role;
    } else {
        let query = "SELECT * FROM roles"
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