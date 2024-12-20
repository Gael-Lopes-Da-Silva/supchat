import bcrypt from "bcrypt";
import pool from "../database/db.js";

// --------------------
// Create
// --------------------

/**
 * Creates a new user in the database.
 * 
 * This function inserts a new user record into the `users` table using the data provided in the request body.
 * The password is securely hashed using bcrypt before being stored. Optional fields like `status`, `link_google`, 
 * and `link_facebook` can also be set during user creation. The function validates the provided `status` 
 * (if specified) to ensure it exists in the database.
 * 
 * @param {Object} request - The HTTP request object containing user data.
 * @param {Object} request.body - The request body containing user information.
 * @param {string} request.body.username - The username of the new user (required).
 * @param {string} request.body.email - The email address of the new user (required).
 * @param {string} request.body.password - The plaintext password of the new user (required).
 * @param {number} [request.body.status] - The ID of the user's status (optional, defaults to 0). 
 *                                         Must exist in the `status` table if provided.
 * @param {boolean} [request.body.link_google] - Whether the user links a Google account (optional, defaults to `false`).
 * @param {boolean} [request.body.link_facebook] - Whether the user links a Facebook account (optional, defaults to `false`).
 * @returns {Promise<Array|Object>} A promise that resolves to the result of the database insert query if successful, 
 *                                  or an error object with an error code and message if validation fails.
 * 
 * Error Responses:
 * - `{ error: 1, error_message: "Status not found" }` if the specified status ID does not exist in the `status` table.
 */
export const createUser = async (request) => {
    if (request.body.status) {
        const statusQuery = await pool.query("SELECT * FROM status WHERE id = ?", [
            request.body.status
        ]);

        if (statusQuery == "") {
            return {
                error: 1,
                error_message: "Status not found"
            };
        };
    }

    return pool.query("INSERT INTO users (username, email, password, status, link_google, link_facebook) VALUES (?, ?, ?, ?, ?, ?)", [
        request.body.username,
        request.body.email,
        bcrypt.hashSync(request.body.password, 10),
        request.body.status || 0,
        request.body.link_google || false,
        request.body.link_facebook || false
    ]);
}

// --------------------
// Read
// --------------------

/**
 * Authenticates a user based on email and optionally validates the password.
 * 
 * This function queries the database for a user with the specified email. If the user exists, it optionally 
 * validates the provided password against the stored hashed password. The function also handles scenarios 
 * where the user is linked to external accounts (Google or Facebook). If no valid password or linked 
 * account is found, an error response is returned.
 * 
 * @param {Object} request - The HTTP request object containing user login data.
 * @param {Object} request.body - The request body containing login credentials.
 * @param {string} request.body.email - The email address of the user to retrieve (required).
 * @param {string} [request.body.password] - The plaintext password to validate (optional).
 * @returns {Promise<Object|Array>} A promise that resolves to:
 * - An array containing user data if authentication is successful.
 * - An error object with an error code and message if authentication fails.
 * 
 * Error Responses:
 * - `{ error: 1, error_message: "User not found" }` if no user with the specified email exists.
 * - `{ error: 1, error_message: "Wrong password" }` if the provided password does not match the stored password.
 * - `{ error: 1, error_message: "User not linked to any socials" }` if no password is provided and the user is not linked to Google or Facebook.
 */
export const loginUser = async (request) => {
    const userQuery = await pool.query("SELECT * FROM users WHERE email = ? AND deleted_at = NULL", [
        request.body.email
    ]);

    if (userQuery == "") {
        return {
            error: 1,
            error_message: "User not found"
        };
    }

    if (request.body.password) {
        const match = await bcrypt.compare(request.body.password, userQuery[0].password);
        return match ? userQuery : {
            error: 1,
            error_message: "Wrong password"
        };
    }

    if (userQuery[0].link_google == 1 || userQuery[0].link_facebook == 1) {
        return userQuery;
    }

    return {
        error: 1,
        error_message: "User not linked to any socials"
    };
}

/**
 * Retrieves one or more users from the database based on specified filter criteria.
 * 
 * This function dynamically constructs and executes an SQL query to fetch user records 
 * from the `users` table. It filters users based on the parameters provided in the request body. 
 * If no parameters are provided, all users (excluding soft-deleted ones) are returned. 
 * Validation is performed for specific filters such as `id` and `status` to ensure they exist in the database.
 * 
 * @param {Object} request - The HTTP request object containing filter criteria.
 * @param {Object} request.body - The request body containing optional filter parameters.
 * @param {number} [request.body.id] - Filter by the user's ID (optional). Must exist in the database if specified.
 * @param {string} [request.body.username] - Filter by the user's username (optional).
 * @param {string} [request.body.email] - Filter by the user's email address (optional).
 * @param {number} [request.body.status] - Filter by the user's status (optional). Must exist in the `status` table if specified.
 * @param {boolean} [request.body.link_google] - Filter by whether the user has linked a Google account (optional).
 * @param {boolean} [request.body.link_facebook] - Filter by whether the user has linked a Facebook account (optional).
 * @returns {Promise<Array|Object>} A promise that resolves to:
 * - An array of matching user records if successful.
 * - An error object with an error code and message if validation fails for specific filters.
 * 
 * Error Responses:
 * - `{ error: 1, error_message: "User not found" }` if no user with the specified `id` exists.
 * - `{ error: 1, error_message: "Status not found" }` if the specified `status` does not exist in the `status` table.
 */
export const readUser = async (request) => {
    let query = "SELECT * FROM users WHERE deleted_at = NULL"
    let params = [];

    if (request.body.id) {
        const userQuery = await pool.query("SELECT * FROM users WHERE id = ? AND deleted_at = NULL", [
            request.body.id
        ]);

        if (userQuery == "") {
            return {
                error: 1,
                error_message: "User not found"
            };
        }

        query += " AND id = ?";
        params.push(request.body.id);
    }

    if (request.body.username) {
        query += " AND username = ?";
        params.push(request.body.username);
    }

    if (request.body.email) {
        query += " AND email = ?";
        params.push(request.body.email);
    }

    if (request.body.status) {
        const statusQuery = await pool.query("SELECT * FROM status WHERE id = ?", [
            request.body.status
        ]);

        if (statusQuery == "") {
            return {
                error: 1,
                error_message: "Status not found"
            };
        };

        query += " AND status = ?";
        params.push(request.body.status);
    }

    if (request.body.link_google) {
        query += " AND link_google = ?";
        params.push(request.body.link_google);
    }

    if (request.body.link_facebook) {
        query += " AND link_facebook = ?";
        params.push(request.body.link_facebook);
    }

    return pool.query(query, params);
}

// --------------------
// Update
// --------------------

/**
 * Updates a user's information in the database based on the provided ID and parameters.
 * 
 * This function retrieves an existing user by their ID and updates their information using 
 * the data provided in the request body. Only the fields specified in the request body are updated, 
 * while all unspecified fields retain their current values. Validation is performed for the `status` 
 * field to ensure it exists in the database if provided.
 * 
 * @param {Object} request - The HTTP request object containing user update data.
 * @param {Object} request.body - The request body containing user update parameters.
 * @param {number} request.body.id - The ID of the user to update (required).
 * @param {string} [request.body.username] - The new username (optional). Defaults to the current username if not provided.
 * @param {string} [request.body.email] - The new email address (optional). Defaults to the current email if not provided.
 * @param {string} [request.body.password] - The new plaintext password (optional). Defaults to the current password if not provided; securely hashed before storage.
 * @param {number} [request.body.status] - The new user status (optional). Must exist in the `status` table if provided. Defaults to the current status.
 * @param {boolean} [request.body.link_google] - Indicates whether the account is linked to Google (optional). Defaults to the current value if not provided.
 * @param {boolean} [request.body.link_facebook] - Indicates whether the account is linked to Facebook (optional). Defaults to the current value if not provided.
 * @returns {Promise<Array|Object>} A promise that resolves to:
 * - An array containing the updated user record if the update is successful.
 * - An error object with an error code and message if validation fails or the user does not exist.
 * 
 * Error Responses:
 * - `{ error: 1, error_message: "User not found" }` if no user with the specified `id` exists.
 * - `{ error: 1, error_message: "Status not found" }` if the specified `status` does not exist in the `status` table.
 */
export const updateUser = async (request) => {
    const userQuery = await pool.query("SELECT * FROM users WHERE id = ? AND deleted_at = NULL", [
        request.body.id
    ]);

    if (userQuery == "") {
        return {
            error: 1,
            error_message: "User not found"
        };
    }

    if (request.body.status) {
        const statusQuery = await pool.query("SELECT * FROM status WHERE id = ?", [
            request.body.status
        ]);

        if (statusQuery == "") {
            return {
                error: 1,
                error_message: "Status not found"
            };
        };
    }

    return pool.query("UPDATE users SET username = ?, email = ?, password = ?, status = ?, link_google = ?, link_facebook = ?, updated_at = NOW() WHERE id = ? AND deleted_at = NULL", [
        request.body.username || userQuery[0].username,
        request.body.email || userQuery[0].email,
        bcrypt.hashSync(request.body.password, 10) || userQuery[0].password,
        request.body.status || userQuery[0].status,
        request.body.link_google || userQuery[0].link_google,
        request.body.link_facebook || userQuery[0].link_facebook,
        request.body.id
    ]);
}

// --------------------
// Delete
// --------------------

/**
 * Soft deletes a user from the database based on the provided ID.
 * 
 * This function marks a user as deleted by setting the `deleted_at` timestamp 
 * to the current time. The user remains in the database but is treated as deleted, 
 * preventing it from being returned in future queries unless explicitly filtered.
 * 
 * @param {Object} request - The HTTP request object containing the user ID to delete.
 * @param {Object} request.body - The request body containing the deletion parameter.
 * @param {number} request.body.id - The ID of the user to delete (required).
 * @returns {Promise<Array|Object>} A promise that resolves to:
 * - An array containing the updated user record if the update is successful.
 * - An error object with an error code and message if validation fails or the user does not exist.
 * 
 * Error Responses:
 * - `{ error: 1, error_message: "User not found" }` if no user with the specified `id` exists and is not marked as deleted.
 */
export const deleteUser = async (request) => {
    const userQuery = await pool.query("SELECT * FROM users WHERE id = ? AND deleted_at = NULL", [
        request.body.id
    ]);

    if (userQuery == "") {
        return {
            error: 1,
            error_message: "User not found"
        };
    }

    return pool.query("UPDATE users SET deleted_at = NOW() WHERE id = ? AND deleted_at = NULL", [
        request.body.id
    ]);
}