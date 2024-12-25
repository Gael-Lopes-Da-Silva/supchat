import pool from "../database/db.js";

// --------------------
// Create
// --------------------

// Add it in base.sql

// --------------------
// Read
// --------------------

export const readRole = async (request) => {
    let query = "SELECT * FROM roles"
    let where = [];
    let params = [];

    if (request.body.id) {
        const [status] = await pool.query("SELECT * FROM roles WHERE id = ?", [
            request.body.id
        ]);

        if (!status) return {
            error: 1,
            error_message: "Role not found"
        };

        where.push("id = ?");
        params.push(request.body.id);
    }

    if (request.body.name) {
        where.push("name = ?");
        params.push(request.body.name);
    }

    if (where > 0) {
        query += " WHERE " + where.join(" AND ");
    }

    return pool.query(query, params);
}

// --------------------
// Update
// --------------------

// Update it in base.sql

// --------------------
// Delete
// --------------------

// Delete it in base.sql