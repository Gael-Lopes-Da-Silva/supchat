import pool from "../database/db.js";

// --------------------
// Create
// --------------------

export const createWorkspace = async (request) => {
    const userResult = await pool.query("SELECT * FROM users WHERE id = ? AND deleted_at = NULL", [
        request.body.user_id
    ]);

    if (userResult === "") return null;

    pool.query("INSERT INTO workspaces (name, description, is_private, user_id) VALUES (?, ?, ?, ?)", [
        request.body.name,
        request.body.description,
        request.body.is_private,
        request.body.user_id
    ]);

    pool.query("INSERT INTO workspace_members (workspace_id, user_id, role) VALUES ((SELECT LAST_INSERT_ID()), ?, ?)", [
        request.body.user_id,
        "admin"
    ]);
};

export const addWorkspaceMember = async (request) => {
    const userResult = await pool.query("SELECT * FROM users WHERE id = ? AND deleted_at = NULL", [
        request.body.user_id
    ]);

    if (userResult === "") return "";

    const workspaceResult = await pool.query("SELECT * FROM workspaces WHERE id = ? AND deleted_at = NULL", [
        request.body.workspace_id
    ]);

    if (workspaceResult === "") return "";

    pool.query("INSERT INTO workspace_members (workspace_id, user_id, role) VALUES (?, ?, role = 'membre')", [
        request.body.workspace_id,
        request.body.user_id
    ]);
};

// --------------------
// Read
// --------------------

export const getWorkspaceById = async () => {
    return pool.query("SELECT * FROM workspaces WHERE id = ? AND deleted_at = NULL", [
        request.body.id
    ]);
};

export const getAllWorkspaces = async () => {
    return pool.query("SELECT * FROM workspaces WHERE deleted_at = NULL");
};

export const getWorkspaceMemberById = async () => {
    return pool.query("SELECT * FROM workspace_members WHERE id = ? AND deleted_at = NULL", [
        request.body.id
    ]);
};

export const getWorkspaceMemberByUserIdAndWorkspaceId = async () => {
    return pool.query("SELECT * FROM workspace_members WHERE user_id = ? AND workspace_id = ? AND deleted_at = NULL", [
        request.body.user_id,
        request.body.workspace_id
    ]);
};

export const getAllWorkspaceMembersByUserId = async () => {
    return pool.query("SELECT * FROM workspace_members WHERE user_id = ? AND deleted_at = NULL", [
        request.body.user_id
    ]);
};

export const getAllWorkspaceMembersByWorkspaceId = async () => {
    return pool.query("SELECT * FROM workspace_members WHERE workspace_id = ? AND deleted_at = NULL", [
        request.body.workspace_id
    ]);
};

// --------------------
// Update
// --------------------

export const updateWorkspace = async (request) => {
    return pool.query("UPDATE workspaces SET name = ?, description = ?, is_private = ?, user_id = ?, updated_at = NOW() WHERE id = ? AND deleted_at = NULL", [
        request.body.name,
        request.body.description,
        request.body.is_private,
        request.body.user_id,
        request.body.id
    ]);
};

export const updateWorkspaceMember = async (request) => {
    return pool.query("UPDATE workspace_members SET workspace_id = ?, user_id = ?, role = ? WHERE id = ? AND deleted_at = NULL", [
        request.body.workspace_id,
        request.body.user_id,
        request.body.role,
        request.body.id
    ]);
};

// --------------------
// Delete
// --------------------

export const deleteWorkspace = async (request) => {
    return pool.query("UPDATE workspaces SET deleted_at = NOW() WHERE id = ? AND deleted_at = NULL", [
        request.body.id
    ]);
};

export const deleteWorkspaceMember = async (request) => {
    return pool.query("UPDATE workspace_members SET deleted_at = NOW() WHERE id = ? AND deleted_at = NULL", [
        request.body.id
    ]);
};

