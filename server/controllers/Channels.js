import pool from "../database/db.js";

// --------------------
// Create
// --------------------

export const createChannel = async (request) => {
    const userResult = await pool.query("SELECT * FROM users WHERE id = ? AND deleted_at = NULL", [
        request.body.user_id
    ]);

    if (userResult === "") return "";
    
    const workspaceResult = await pool.query("SELECT * FROM workspaces WHERE id = ? AND deleted_at = NULL", [
        request.body.workspace_id
    ]);

    if (workspaceResult === "") return "";
    
    pool.query("INSERT INTO channels (workspace_id, name, is_private, user_id) VALUES (?, ?, ?, ?)", [
        request.body.workspace_id,
        request.body.name,
        request.body.is_private,
        request.body.user_id
    ]);
}