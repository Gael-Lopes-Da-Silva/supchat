import pool from "../database/db.js";

// --------------------
// Create
// --------------------

/**
 * Creates a new channel in the database.
 * 
 * This function inserts a new channel record into the `channels` table based on the provided parameters.
 * The user and workspace specified by `user_id` and `workspace_id` respectively must exist and not be soft-deleted (`deleted_at` is NULL).
 * If either the user or workspace does not exist, the function returns an empty string.
 * 
 * @param {Object} request - The HTTP request object containing the new channel data.
 * @param {Object} request.body - The request body containing the necessary parameters for creating the channel.
 * @param {number} request.body.user_id - The ID of the user creating the channel (required).
 * @param {number} request.body.workspace_id - The ID of the workspace where the channel will be created (required).
 * @param {string} request.body.name - The name of the new channel (required).
 * @param {string} request.body.role - The role assigned to the channel (required).
 * @param {boolean} request.body.is_private - Indicates whether the channel is private or not (required).
 * @returns {Promise<Array|String>} A promise that resolves to the result of the insert query, or an empty string if the user or workspace does not exist.
 */
export const createChannel = async (request) => {
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
    
    return pool.query("INSERT INTO channels (workspace_id, name, is_private, role, user_id) VALUES (?, ?, ?, ?, ?)", [
        request.body.workspace_id,
        request.body.name,
        request.body.is_private,
        request.body.role,
        request.body.user_id
    ]);
}

// --------------------
// Read
// --------------------

/**
 * Retrieves channels from the database based on the provided search criteria.
 * 
 * This function fetches channel records from the `channels` table based on various optional search criteria provided in the request body.
 * The function allows for filtering based on channel properties such as `id`, `workspace_id`, `name`, `is_private`, and `user_id`.
 * The search results exclude soft-deleted records (i.e., where `deleted_at` is not NULL).
 * 
 * @param {Object} request - The HTTP request object containing the search criteria.
 * @param {Object} request.body - The request body containing the optional parameters for filtering the channels.
 * @param {number} [request.body.id] - The ID of the channel to search for (optional).
 * @param {number} [request.body.workspace_id] - The workspace ID to search for channels within (optional).
 * @param {string} [request.body.name] - The name of the channel to search for (optional).
 * @param {string} [request.body.role] - The role assigned to the channel (optional).
 * @param {boolean} [request.body.is_private] - Whether to filter by private status of the channel (optional).
 * @param {number} [request.body.user_id] - The ID of the user who created the channel to search for (optional).
 * @returns {Promise<Array>} A promise that resolves to an array of channels that match the search criteria, or an empty array if no matching channels are found.
 */
export const readChannel = async (request) => {
    let query = "SELECT * FROM channels WHERE deleted_at = NULL"
    let params = [];
    
    if (request.body.id) {
        query += " AND id = ?";
        params.push(request.body.id);
    }
    
    if (request.body.workspace_id) {
        query += " AND workspace_id = ?";
        params.push(request.body.workspace_id);
    }
    
    if (request.body.name) {
        query += " AND name = ?";
        params.push(request.body.name);
    }
    
    if (request.body.role) {
        query += " AND role = ?";
        params.push(request.body.role);
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
}

// --------------------
// Update
// --------------------

/**
 * Updates an existing channel in the database.
 * 
 * This function updates the properties of an existing channel based on the provided request body. 
 * The channel specified by `id` must exist and not be soft-deleted (`deleted_at` is NULL).
 * The update only modifies the fields provided in the request body; any fields not specified will retain their current values.
 * 
 * @param {Object} request - The HTTP request object containing the new channel data.
 * @param {Object} request.body - The request body containing the parameters for updating the channel.
 * @param {number} request.body.id - The ID of the channel to be updated (required).
 * @param {number} [request.body.workspace_id] - The new workspace ID to assign to the channel (optional).
 * @param {string} [request.body.name] - The new name for the channel (optional).
 * @param {string} [request.body.role] - The role assigned to the channel (optional).
 * @param {boolean} [request.body.is_private] - The new private status of the channel (optional).
 * @param {number} [request.body.user_id] - The new user ID of the creator of the channel (optional).
 * @returns {Promise<Array|String>} A promise that resolves to the result of the update query, or an empty string if the channel does not exist or is already soft-deleted.
 */
export const updateChannel = async (request) => {
    const channelQuery = await pool.query("SELECT * FROM channel WHERE id = ? AND deleted_at = NULL", [
        request.body.id
    ]);
    
    if (channelQuery == "") {
        return "";
    }
    
    return pool.query("UPDATE channels SET workspace_id = ?, name = ?, is_private = ?, role = ?, user_id = ?, updated_at = NOW() WHERE id = ? AND deleted_at = NULL", [
        request.body.workspace_id || channelQuery[0].workspace_id,
        request.body.name || channelQuery[0].name,
        request.body.is_private || channelQuery[0].is_private,
        request.body.role || channelQuery[0].role,
        request.body.user_id || channelQuery[0].user_id,
        request.body.id
    ]);
}

// --------------------
// Delete
// --------------------

/**
 * Soft deletes a channel from the database.
 * 
 * This function performs a soft delete operation on a channel specified by its `id`. 
 * The channel is marked as deleted by setting its `deleted_at` timestamp to the current time.
 * The channel specified by `id` must exist and not already be soft-deleted (`deleted_at` is NULL).
 * 
 * @param {Object} request - The HTTP request object containing the channel ID.
 * @param {Object} request.body - The request body containing the ID of the channel to be deleted.
 * @param {number} request.body.id - The ID of the channel to be soft-deleted (required).
 * @returns {Promise<Array>} A promise that resolves to the result of the update query, or an empty array if the channel does not exist or is already soft-deleted.
 */
export const deleteChannel = async (request) => {
    return pool.query("UPDATE channels SET deleted_at = NOW() WHERE id = ? AND deleted_at = NULL", [
        request.body.id
    ]);
}