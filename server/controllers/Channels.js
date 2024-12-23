import pool from "../database/db.js";

// --------------------
// Create
// --------------------

/**
 * Creates a new channel in the database.
 *
 * This function inserts a new channel record into the `channels` table based on the provided parameters.
 * The user and workspace specified by `user_id` and `workspace_id` respectively must exist and not be soft-deleted (`deleted_at` is NULL).
 * If either the user or workspace does not exist, the function returns an error object.
 *
 * @param {Object} request - The HTTP request object containing the new channel data.
 * @param {Object} request.body - The request body containing the necessary parameters for creating the channel.
 * @param {number} request.body.user_id - The ID of the user creating the channel (required).
 * @param {number} request.body.workspace_id - The ID of the workspace where the channel will be created (required).
 * @param {string} request.body.name - The name of the new channel (required).
 * @param {boolean} request.body.is_private - Indicates whether the channel is private or not (required).
 * @returns {Promise<Array|Object>} A promise that resolves to the result of the insert query if the user and workspace exist and are not soft-deleted,
 *                                  or an error object if the user or workspace does not exist.
 *
 * Error Responses:
 * - `{ error: 1, error_message: "User not found" }` if the specified user ID does not exist or is soft-deleted.
 * - `{ error: 1, error_message: "Workspace not found" }` if the specified workspace ID does not exist or is soft-deleted.
 */
export const createChannel = async (request) => {
    const userQuery = await pool.query("SELECT * FROM users WHERE id = ? AND deleted_at = NULL", [
        request.body.user_id
    ]);

    if (userQuery == "") {
        return {
            error: 1,
            error_message: "User not found"
        };
    }

    const workspaceQuery = await pool.query("SELECT * FROM workspaces WHERE id = ? AND deleted_at = NULL", [
        request.body.workspace_id
    ]);

    if (workspaceQuery == "") {
        return {
            error: 1,
            error_message: "Workspace not found"
        };
    }

    return pool.query("INSERT INTO channels (workspace_id, name, is_private, user_id) VALUES (?, ?, ?, ?, ?)", [
        request.body.workspace_id,
        request.body.name,
        request.body.is_private,
        request.body.user_id
    ]);
}

/**
 * Adds a new member to a channel in the database.
 *
 * This function inserts a new record into the `channel_members` table to associate a user with a channel and a specific role.
 * It ensures that the channel, user, and role exist in the database and are not soft-deleted (`deleted_at` is NULL) before performing the insertion.
 *
 * @param {Object} request - The HTTP request object containing the necessary parameters for creating the channel member.
 * @param {Object} request.body - The request body containing the parameters.
 * @param {number} request.body.channel_id - The ID of the channel where the user is being added (required).
 * @param {number} request.body.user_id - The ID of the user being added to the channel (required).
 * @param {number} request.body.role - The role ID to assign to the user in the channel (required).
 * @returns {Promise<Object|Array>} A promise that resolves to the result of the insert query if successful,
 *                                  or an error object with an error code and message if the channel, user, or role does not exist.
 *
 * Error Responses:
 * - `{ error: 1, error_message: "Channel not found" }` if the specified channel ID does not exist or is soft-deleted.
 * - `{ error: 1, error_message: "User not found" }` if the specified user ID does not exist or is soft-deleted.
 * - `{ error: 1, error_message: "Role not found" }` if the specified role ID does not exist or is invalid.
 */
export const createChannelMember = async (request) => {
    const channelQuery = await pool.query("SELECT * FROM channels WHERE id = ? AND deleted_at = NULL", [
        request.body.channel_id
    ]);

    if (channelQuery == "") {
        return {
            error: 1,
            error_message: "Channel not found"
        };
    }

    const userQuery = await pool.query("SELECT * FROM users WHERE id = ? AND deleted_at = NULL", [
        request.body.user_id
    ]);

    if (userQuery == "") {
        return {
            error: 1,
            error_message: "User not found"
        };
    }

    const roleQuery = await pool.query("SELECT * FROM roles WHERE id = ?", [
        request.body.workspace_id
    ]);

    if (roleQuery == "") {
        return {
            error: 1,
            error_message: "Role not found"
        };
    }

    return pool.query("INSERT INTO channel_members (channel_id, user_id, role) VALUES (?, ?, ?, ?, ?)", [
        request.body.channel_id,
        request.body.user_id,
        request.body.role
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
 * @param {boolean} [request.body.is_private] - Whether to filter by private status of the channel (optional).
 * @param {number} [request.body.user_id] - The ID of the user who created the channel to search for (optional).
 * @returns {Promise<Array>} A promise that resolves to an array of channels that match the search criteria, or an empty array if no matching channels are found.
 *
 * Error Responses:
 * - `{ error: 1, error_message: "Channel not found" }` if the specified channel ID does not exist or is soft-deleted.
 * - `{ error: 1, error_message: "Workspace not found" }` if the specified workspace ID does not exist or is soft-deleted.
 * - `{ error: 1, error_message: "User not found" }` if the specified user ID does not exist or is soft-deleted.
 */
export const readChannel = async (request) => {
    let query = "SELECT * FROM channels WHERE deleted_at = NULL"
    let params = [];

    if (request.body.id) {
        const channelQuery = await pool.query("SELECT * FROM channels WHERE id = ? AND deleted_at = NULL", [
            request.body.id
        ]);

        if (channelQuery == "") {
            return {
                error: 1,
                error_message: "Channel not found"
            };
        }

        query += " AND id = ?";
        params.push(request.body.id);
    }

    if (request.body.workspace_id) {
        const workspaceQuery = await pool.query("SELECT * FROM workspaces WHERE id = ? AND deleted_at = NULL", [
            request.body.workspace_id
        ]);

        if (workspaceQuery == "") {
            return {
                error: 1,
                error_message: "Workspace not found"
            };
        }

        query += " AND workspace_id = ?";
        params.push(request.body.workspace_id);
    }

    if (request.body.name) {
        query += " AND name = ?";
        params.push(request.body.name);
    }

    if (request.body.is_private) {
        query += " AND is_private = ?";
        params.push(request.body.is_private);
    }

    if (request.body.user_id) {
        const userQuery = await pool.query("SELECT * FROM users WHERE id = ? AND deleted_at = NULL", [
            request.body.user_id
        ]);

        if (userQuery == "") {
            return {
                error: 1,
                error_message: "User not found"
            };
        }

        query += " AND user_id = ?";
        params.push(request.body.user_id);
    }

    return pool.query(query, params);
}

/**
 * Retrieves channel member records based on specified criteria.
 *
 * This function queries the `channel_members` table for records that match the provided filters, ensuring that the
 * channel, user, and role exist in the database and are not soft-deleted (`deleted_at` is NULL). If any filter does not
 * correspond to an existing record, an error response is returned.
 *
 * @param {Object} request - The HTTP request object containing the filter parameters.
 * @param {Object} request.body - The request body containing the parameters for filtering.
 * @param {number} [request.body.id] - The ID of the channel member to retrieve (optional).
 * @param {number} [request.body.channel_id] - The ID of the channel to filter by (optional).
 * @param {number} [request.body.user_id] - The ID of the user to filter by (optional).
 * @param {number} [request.body.role] - The role ID to filter by (optional).
 * @returns {Promise<Array|Object>} A promise that resolves to the result of the query if successful,
 * or an error object with an error code and message if any filter does not match a valid record.
 *
 * Error Responses:
 * - `{ error: 1, error_message: "Channel member not found" }` if the specified channel member ID does not exist or is soft-deleted.
 * - `{ error: 1, error_message: "Channel not found" }` if the specified channel ID does not exist or is soft-deleted.
 * - `{ error: 1, error_message: "User not found" }` if the specified user ID does not exist or is soft-deleted.
 * - `{ error: 1, error_message: "Role not found" }` if the specified role ID does not exist or is invalid.
 */
export const readChannelMember = async (request) => {
    let query = "SELECT * FROM channel_members WHERE deleted_at = NULL"
    let params = [];

    if (request.body.id) {
        const channelMemberQuery = await pool.query("SELECT * FROM channel_members WHERE id = ? AND deleted_at = NULL", [
            request.body.id
        ]);

        if (channelMemberQuery == "") {
            return {
                error: 1,
                error_message: "Channel member not found"
            };
        }

        query += " AND id = ?";
        params.push(request.body.id);
    }

    if (request.body.channel_id) {
        const channelQuery = await pool.query("SELECT * FROM channels WHERE id = ? AND deleted_at = NULL", [
            request.body.channel_id
        ]);

        if (channelQuery == "") {
            return {
                error: 1,
                error_message: "Channel not found"
            };
        }

        query += " AND channel_id = ?";
        params.push(request.body.channel_id);
    }

    if (request.body.user_id) {
        const userQuery = await pool.query("SELECT * FROM users WHERE id = ? AND deleted_at = NULL", [
            request.body.user_id
        ]);

        if (userQuery == "") {
            return {
                error: 1,
                error_message: "User not found"
            };
        }

        query += " AND user_id = ?";
        params.push(request.body.user_id);
    }

    if (request.body.role) {
        const roleQuery = await pool.query("SELECT * FROM roles WHERE id = ?", [
            request.body.workspace_id
        ]);

        if (roleQuery == "") {
            return {
                error: 1,
                error_message: "Role not found"
            };
        }

        query += " AND role = ?";
        params.push(request.body.role);
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
 * @param {boolean} [request.body.is_private] - The new private status of the channel (optional).
 * @param {number} [request.body.user_id] - The new user ID of the creator of the channel (optional).
 * @returns {Promise<Array|String>} A promise that resolves to the result of the update query, or an empty string if the channel does not exist or is already soft-deleted.
 *
 * Error Responses:
 * - `{ error: 1, error_message: "Channel not found" }` if the specified channel ID does not exist or is soft-deleted.
 * - `{ error: 1, error_message: "Workspace not found" }` if the specified workspace ID does not exist or is soft-deleted.
 * - `{ error: 1, error_message: "User not found" }` if the specified user ID does not exist or is soft-deleted.
 */
export const updateChannel = async (request) => {
    const channelQuery = await pool.query("SELECT * FROM channels WHERE id = ? AND deleted_at = NULL", [
        request.body.id
    ]);

    if (channelQuery == "") {
        return {
            error: 1,
            error_message: "Channel not found"
        };
    }

    if (request.body.workspace_id) {
        const workspaceQuery = await pool.query("SELECT * FROM workspaces WHERE id = ? AND deleted_at = NULL", [
            request.body.workspace_id
        ]);

        if (workspaceQuery == "") {
            return {
                error: 1,
                error_message: "Workspace not found"
            };
        }
    }

    if (request.body.user_id) {
        const userQuery = await pool.query("SELECT * FROM users WHERE id = ? AND deleted_at = NULL", [
            request.body.user_id
        ]);

        if (userQuery == "") {
            return {
                error: 1,
                error_message: "User not found"
            };
        }
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

/**
 * Updates an existing channel member record in the database.
 *
 * This function modifies the `channel_members` table for the specified channel member ID. Before updating, it ensures
 * that the channel member, channel, user, and role (if provided) exist and are not soft-deleted (`deleted_at` is NULL).
 * If any of these conditions are not met, an error response is returned.
 *
 * @param {Object} request - The HTTP request object containing the parameters for the update.
 * @param {Object} request.body - The request body containing the updated data.
 * @param {number} request.body.id - The ID of the channel member to update (required).
 * @param {number} [request.body.channel_id] - The new channel ID to associate with the channel member (optional).
 * @param {number} [request.body.user_id] - The new user ID to associate with the channel member (optional).
 * @param {number} [request.body.role] - The new role ID to assign to the channel member (optional).
 * @returns {Promise<Array|Object>} A promise that resolves to the result of the update query if successful,
 * or an error object with an error code and message if validation fails.
 *
 * Error Responses:
 * - `{ error: 1, error_message: "Channel member not found" }` if the specified channel member ID does not exist or is soft-deleted.
 * - `{ error: 1, error_message: "Channel not found" }` if the specified channel ID does not exist or is soft-deleted.
 * - `{ error: 1, error_message: "User not found" }` if the specified user ID does not exist or is soft-deleted.
 * - `{ error: 1, error_message: "Role not found" }` if the specified role ID does not exist or is invalid.
 */

export const updateChannelMember = async (request) => {
    const channelMemberQuery = await pool.query("SELECT * FROM channel_members WHERE id = ? AND deleted_at = NULL", [
        request.body.id
    ]);

    if (channelMemberQuery == "") {
        return {
            error: 1,
            error_message: "Channel member not found"
        };
    }

    if (request.body.channel_id) {
        const channelQuery = await pool.query("SELECT * FROM channels WHERE id = ? AND deleted_at = NULL", [
            request.body.channel_id
        ]);

        if (channelQuery == "") {
            return {
                error: 1,
                error_message: "Channel not found"
            };
        }
    }

    if (request.body.user_id) {
        const userQuery = await pool.query("SELECT * FROM users WHERE id = ? AND deleted_at = NULL", [
            request.body.user_id
        ]);

        if (userQuery == "") {
            return {
                error: 1,
                error_message: "User not found"
            };
        }
    }

    if (request.body.role) {
        const roleQuery = await pool.query("SELECT * FROM roles WHERE id = ?", [
            request.body.workspace_id
        ]);

        if (roleQuery == "") {
            return {
                error: 1,
                error_message: "Role not found"
            };
        }
    }

    return pool.query("UPDATE channel_members SET channel_id = ?, user_id = ?, role = ?, updated_at = NOW() WHERE id = ? AND deleted_at = NULL", [
        request.body.channel_id || channelMemberQuery[0].channel_id,
        request.body.user_id || channelMemberQuery[0].user_id,
        request.body.role || channelMemberQuery[0].role,
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
 *
 * Error Responses:
 * - `{ error: 1, error_message: "Channel not found" }` if the specified channel ID does not exist or is soft-deleted.
 */
export const deleteChannel = async (request) => {
    const channelQuery = await pool.query("SELECT * FROM channels WHERE id = ? AND deleted_at = NULL", [
        request.body.id
    ]);

    if (channelQuery == "") {
        return {
            error: 1,
            error_message: "Channel not found"
        };
    }

    return pool.query("UPDATE channels SET deleted_at = NOW() WHERE id = ? AND deleted_at = NULL", [
        request.body.id
    ]);
}

/**
 * Soft-deletes a channel member record in the database.
 *
 * This function marks a channel member record as deleted by setting its `deleted_at` timestamp to the current time.
 * Before performing the update, it verifies that the specified channel member exists and is not already soft-deleted (`deleted_at` is NULL).
 *
 * @param {Object} request - The HTTP request object containing the parameters for deletion.
 * @param {Object} request.body - The request body containing the required data.
 * @param {number} request.body.id - The ID of the channel member to delete (required).
 * @returns {Promise<Array|Object>} A promise that resolves to the result of the soft-delete query if successful,
 * or an error object with an error code and message if the channel member does not exist.
 *
 * Error Responses:
 * - `{ error: 1, error_message: "Channel member not found" }` if the specified channel member ID does not exist or is soft-deleted.
 */

export const deleteChannelMember = async (request) => {
    const channelMemberQuery = await pool.query("SELECT * FROM channel_members WHERE id = ? AND deleted_at = NULL", [
        request.body.id
    ]);

    if (channelMemberQuery == "") {
        return {
            error: 1,
            error_message: "Channel member not found"
        };
    }

    return pool.query("UPDATE channel_members SET deleted_at = NOW() WHERE id = ? AND deleted_at = NULL", [
        request.body.id
    ]);
}