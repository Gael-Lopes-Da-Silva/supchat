import pool from "../database/db.js";
import { ERRORS, createErrorResponse } from "../app/ErrorHandler.js";

export const readStatus = async (request) => {
    if (request.params.id) {
        const [status] = await pool.query("SELECT * FROM status WHERE id = ?", [request.body.id]);
        if (!status) return createErrorResponse(ERRORS.STATUS_NOT_FOUND);
        return status;
    } else {
        let query = "SELECT * FROM status"
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