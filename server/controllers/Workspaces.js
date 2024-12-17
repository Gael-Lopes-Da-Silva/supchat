import pool from "../database/db.js";

export const readWorkspaces = async () => {
    return pool.query("SELECT * FROM workspaces WHERE deleted_at IS NULL");
};

export const createWorkspaces = async (request) => {
    const { name, description, is_private, creator_id } = request.body;

    const [workspaceResult] = await pool.query(
        "INSERT INTO workspaces (name, description, is_private, creator_id) VALUES (?, ?, ?, ?)",
        [name, description, is_private, creator_id]
    );

    if (workspaceResult.affectedRows === 0) {
        throw new Error("Échec de la création du workspace.");
    }

    const workspaceId = workspaceResult.insertId;

    const [memberResult] = await pool.query(
        "INSERT INTO workspace_members (workspace_id, user_id, role) VALUES (?, ?, ?)",
        [workspaceId, creator_id, 'admin']
    );

    if (memberResult.affectedRows === 0) {
        throw new Error("Échec de l'ajout du membre au workspace.");
    }

    return { success: true, workspace: workspaceResult };
};

export const updateWorkspaces = async (request) => {
    const { id, name, description, is_private } = request.body;

    return pool.query(
        "UPDATE workspaces SET name = ?, description = ?, is_private = ?, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL",
        [name, description, is_private, id]
    );
};

export const deleteWorkspaces = async (request) => {
    const { id } = request.body;

    return pool.query(
        "UPDATE workspaces SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL",
        [id]
    );
};

export const createWorkspacesMember = async (request) => {
    const { workspace_id, user_id } = request.body;

    return pool.query(
        "INSERT INTO workspace_members (workspace_id, user_id, role) VALUES (?, ?, role = 'membre')",
        [ workspace_id, user_id ]
    );
};

export const readWorkspacesUser = async (user_id) => {
    const query = `
        SELECT 
            w.id AS workspace_id,
            w.name AS workspace_name,
            w.description,
            w.is_private,
            w.creator_id,
            w.created_at,
            wm.user_id AS member_user_id,
            wm.role AS member_role,
            wm.added_at AS member_added_at
        FROM 
            workspaces w
        JOIN 
            workspace_members wm ON w.id = wm.workspace_id
        WHERE 
            wm.user_id = ? AND w.deleted_at IS NULL
    `;

    return pool.query(query, [user_id]);
};

