import pool from "../database/db.js";

export const readStatus = async (request) => {
    if (request.params.id) {
        const [status] = await pool.query("SELECT * FROM status WHERE id = ?", [
            request.body.id
        ]);

        if (!status) return {
            error: 1,
            error_message: "Status not found"
        };

        return status;
    } else {
        let query = "SELECT * FROM status"
        let where = [];
        let params = [];

        if (request.query.name) {
            where.push("name = ?");
            params.push(request.query.name);
        }

        if (where > 0) {
            query += " WHERE " + where.join(" AND ");
        }

        return pool.query(query, params);
    }
}