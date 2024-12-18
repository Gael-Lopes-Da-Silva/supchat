import pool from "../database/db.js";

// --------------------
// Create
// --------------------

/**
 * Creates a new workspace in the database.
 * 
 * This function inserts a new workspace record into the `workspaces` table. 
 * The user specified by `user_id` must exist and not be soft-deleted (`deleted_at` is NULL). 
 * The workspace's creator is automatically added to the `workspace_members` table as an admin, 
 * provided the database trigger is set up correctly.
 * 
 * @param {Object} request - The HTTP request object containing workspace data.
 * @param {Object} request.body - The request body containing the necessary parameters.
 * @param {string} request.body.name - The name of the workspace (required).
 * @param {string} request.body.description - A brief description of the workspace (required).
 * @param {boolean} request.body.is_private - Whether the workspace is private (required).
 * @param {number} request.body.user_id - The ID of the user creating the workspace (required).
 * @returns {Promise<Array|String>} A promise that resolves to the result of the workspace insertion query, 
 * or an empty string if the user does not exist or is soft-deleted.
 */
export const createWorkspace = async (request) => {
    const userQuery = await pool.query("SELECT * FROM users WHERE id = ? AND deleted_at = NULL", [
        request.body.user_id
    ]);

    if (userQuery == "") {
        return "";
    };

    return pool.query("INSERT INTO workspaces (name, description, is_private, user_id) VALUES (?, ?, ?, ?)", [
        request.body.name,
        request.body.description,
        request.body.is_private,
        request.body.user_id
    ]);
};

/**
 * Adds a new member to a workspace in the database.
 * 
 * This function inserts a new record into the `workspace_members` table to associate 
 * a user with a workspace and assign them a role. The user and workspace must both exist 
 * and not be soft-deleted (`deleted_at` is NULL).
 * 
 * @param {Object} request - The HTTP request object containing member data.
 * @param {Object} request.body - The request body containing the necessary parameters.
 * @param {number} request.body.user_id - The ID of the user to be added as a workspace member (required).
 * @param {number} request.body.workspace_id - The ID of the workspace to which the user is being added (required).
 * @param {string} request.body.role - The role to assign to the user in the workspace (required, e.g., "admin" or "member").
 * @returns {Promise<Array|String>} A promise that resolves to the result of the membership insertion query, 
 * or an empty string if the user or workspace does not exist or is soft-deleted.
 */
export const createWorkspaceMember = async (request) => {
    const userQuery = await pool.query("SELECT * FROM users WHERE id = ? AND deleted_at = NULL", [
        request.body.user_id
    ]);

    if (userQuery == "") {
        return "";
    }

    const workspaceQuery = await pool.query("SELECT * FROM workspaces WHERE id = ? AND deleted_at = NULL", [
        request.body.workspace_id
    ]);

    if (workspaceQuery == "") {
        return "";
    }

    return pool.query("INSERT INTO workspace_members (workspace_id, user_id, role) VALUES (?, ?, ?)", [
        request.body.workspace_id,
        request.body.user_id,
        request.body.role
    ]);
};

// --------------------
// Read
// --------------------

/**
 * Retrieves one or more workspaces from the database based on specified parameters.
 * 
 * This function constructs a dynamic SQL query to fetch workspaces from the `workspaces` table.
 * The query filters the workspaces based on the parameters provided in the request body. If no parameters
 * are provided, all non-deleted workspaces are returned.
 * 
 * @param {Object} request - The HTTP request object containing filter criteria.
 * @param {Object} request.body - The request body containing optional filter parameters.
 * @param {number} [request.body.id] - Filter by workspace ID (optional).
 * @param {string} [request.body.name] - Filter by workspace name (optional).
 * @param {string} [request.body.description] - Filter by workspace description (optional).
 * @param {boolean} [request.body.is_private] - Filter by privacy status (optional).
 * @param {number} [request.body.user_id] - Filter by the ID of the user who created the workspace (optional).
 * @returns {Promise<Array>} A promise that resolves to an array of matching workspace records or an empty array if none match.
 */
export const readWorkspace = async () => {
    let query = "SELECT * FROM workspaces WHERE deleted_at = NULL"
    let params = [];
    
    if (request.body.id) {
        query += " AND id = ?";
        params.push(request.body.id);
    }
    
    if (request.body.name) {
        query += " AND name = ?";
        params.push(request.body.name);
    }
    
    if (request.body.description) {
        query += " AND description = ?";
        params.push(request.body.description);
    }
    
    if (request.body.is_private) {
        query += " AND is_private = ?";
        params.push(request.body.is_private);
    }
    
    if (request.body.user_id) {
        query += " AND user_id = ?";
        params.push(request.body.user_id);
    }
    
    return pool.query(query, params);
};

/**
 * Retrieves one or more workspace members from the database based on specified parameters.
 * 
 * This function constructs a dynamic SQL query to fetch records from the `workspace_members` table.
 * The query filters workspace members based on the parameters provided in the request body. If no parameters
 * are provided, all non-deleted workspace members are returned.
 * 
 * @param {Object} request - The HTTP request object containing filter criteria.
 * @param {Object} request.body - The request body containing optional filter parameters.
 * @param {number} [request.body.id] - Filter by workspace member ID (optional).
 * @param {number} [request.body.workspace_id] - Filter by workspace ID (optional).
 * @param {number} [request.body.user_id] - Filter by user ID (optional).
 * @param {string} [request.body.role] - Filter by member role (optional, e.g., "admin" or "member").
 * @returns {Promise<Array>} A promise that resolves to an array of matching workspace member records or an empty array if none match.
 */
export const readWorkspaceMember = async () => {
    let query = "SELECT * FROM workspace_members WHERE deleted_at = NULL"
    let params = [];
    
    if (request.body.id) {
        query += " AND id = ?";
        params.push(request.body.id);
    }
    
    if (request.body.workspace_id) {
        query += " AND workspace_id = ?";
        params.push(request.body.workspace_id);
    }
    
    if (request.body.user_id) {
        query += " AND user_id = ?";
        params.push(request.body.user_id);
    }
    
    if (request.body.role) {
        query += " AND role = ?";
        params.push(request.body.role);
    }
    
    return pool.query(query, params);
};

// --------------------
// Update
// --------------------

/**
 * Updates an existing workspace in the database.
 * 
 * This function updates the details of an existing workspace in the `workspaces` table based on the provided parameters.
 * The workspace specified by `id` must exist and not be soft-deleted (`deleted_at` is NULL).
 * The function allows partial updates by updating only the fields that are provided in the request body.
 * If a field is not provided, the current value is retained.
 * 
 * @param {Object} request - The HTTP request object containing the updated workspace data.
 * @param {Object} request.body - The request body containing the necessary parameters for updating the workspace.
 * @param {number} request.body.id - The ID of the workspace to update (required).
 * @param {string} [request.body.name] - The new name for the workspace (optional).
 * @param {string} [request.body.description] - The new description for the workspace (optional).
 * @param {boolean} [request.body.is_private] - The new privacy status for the workspace (optional).
 * @param {number} [request.body.user_id] - The new user ID for the workspace (optional).
 * @returns {Promise<Array|String>} A promise that resolves to the result of the update query, or an empty string if the workspace does not exist or is soft-deleted.
 */
export const updateWorkspace = async (request) => {
    const workspaceQuery = await pool.query("SELECT * FROM workspaces WHERE id = ? AND deleted_at = NULL", [
        request.body.id
    ]);
    
    if (workspaceQuery == "") {
        return "";
    }
    
    return pool.query("UPDATE workspaces SET name = ?, description = ?, is_private = ?, user_id = ?, updated_at = NOW() WHERE id = ? AND deleted_at = NULL", [
        request.body.name || workspaceQuery[0].name,
        request.body.description || workspaceQuery[0].description,
        request.body.is_private || workspaceQuery[0].is_private,
        request.body.user_id || workspaceQuery[0].user_id,
        request.body.id
    ]);
};

/**
 * Updates an existing workspace member in the database.
 * 
 * This function updates the details of an existing member within a workspace in the `workspace_members` table based on the provided parameters.
 * The workspace member specified by `id` must exist and not be soft-deleted (`deleted_at` is NULL).
 * The function allows partial updates by updating only the fields that are provided in the request body.
 * If a field is not provided, the current value is retained.
 * 
 * @param {Object} request - The HTTP request object containing the updated workspace member data.
 * @param {Object} request.body - The request body containing the necessary parameters for updating the workspace member.
 * @param {number} request.body.id - The ID of the workspace member to update (required).
 * @param {number} [request.body.workspace_id] - The new workspace ID for the member (optional).
 * @param {number} [request.body.user_id] - The new user ID for the member (optional).
 * @param {string} [request.body.role] - The new role for the workspace member (optional, e.g., "admin" or "member").
 * @returns {Promise<Array|String>} A promise that resolves to the result of the update query, or an empty string if the workspace member does not exist or is soft-deleted.
 */
export const updateWorkspaceMember = async (request) => {
    const workspaceMemberQuery = await pool.query("SELECT * FROM workspaces WHERE id = ? AND deleted_at = NULL", [
        request.body.id
    ]);
    
    if (workspaceMemberQuery == "") {
        return "";
    }
    
    return pool.query("UPDATE workspace_members SET workspace_id = ?, user_id = ?, role = ? WHERE id = ? AND deleted_at = NULL", [
        request.body.workspace_id || workspaceMemberQuery[0].workspace_id,
        request.body.user_id || workspaceMemberQuery[0].user_id,
        request.body.role || workspaceMemberQuery[0].role,
        request.body.id
    ]);
};

// --------------------
// Delete
// --------------------

/**
 * Marks a workspace as deleted in the database.
 * 
 * This function sets the `deleted_at` timestamp for a workspace in the `workspaces` table to indicate that the workspace is soft-deleted.
 * The workspace specified by `id` must exist and not be already soft-deleted (`deleted_at` is NULL).
 * 
 * @param {Object} request - The HTTP request object containing the workspace ID.
 * @param {Object} request.body - The request body containing the necessary parameter.
 * @param {number} request.body.id - The ID of the workspace to be deleted (required).
 * @returns {Promise<Array|String>} A promise that resolves to the result of the update query, or an empty string if the workspace does not exist or is already soft-deleted.
 */
export const deleteWorkspace = async (request) => {
    return pool.query("UPDATE workspaces SET deleted_at = NOW() WHERE id = ? AND deleted_at = NULL", [
        request.body.id
    ]);
};

/**
 * Marks a workspace member as deleted in the database.
 * 
 * This function sets the `deleted_at` timestamp for a workspace member in the `workspace_members` table to indicate that the member is soft-deleted.
 * The workspace member specified by `id` must exist and not be already soft-deleted (`deleted_at` is NULL).
 * 
 * @param {Object} request - The HTTP request object containing the workspace member ID.
 * @param {Object} request.body - The request body containing the necessary parameter.
 * @param {number} request.body.id - The ID of the workspace member to be deleted (required).
 * @returns {Promise<Array|String>} A promise that resolves to the result of the update query, or an empty string if the workspace member does not exist or is already soft-deleted.
 */
export const deleteWorkspaceMember = async (request) => {
    return pool.query("UPDATE workspace_members SET deleted_at = NOW() WHERE id = ? AND deleted_at = NULL", [
        request.body.id
    ]);
};

