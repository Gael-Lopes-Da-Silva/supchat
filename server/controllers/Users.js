import bcrypt from "bcrypt";
import pool from "../database/db.js";

// --------------------
// Create
// --------------------

/**
 * Creates a new user in the database.
 * 
 * This function inserts a new user record into the `users` table using the data provided in the request body.
 * The password is securely hashed using bcrypt before being stored. The function also allows setting optional 
 * fields like `status`, `link_google`, and `link_facebook`.
 * 
 * @param {Object} request - The HTTP request object containing user data.
 * @param {Object} request.body - The request body containing user information.
 * @param {string} request.body.username - The username of the new user (required).
 * @param {string} request.body.email - The email address of the new user (required).
 * @param {string} request.body.password - The plaintext password of the new user (required).
 * @param {string} request.body.status - The status of the user (optional).
 * @param {string} [request.body.link_google] - The link to Google account (optional).
 * @param {string} [request.body.link_facebook] - The link to Facebook account (optional).
 * @returns {Promise<Array>} A promise that resolves to the result of the database insert query.
 */
export const createUser = async (request) => {
    return pool.query("INSERT INTO users (username, email, password, status, link_google, link_facebook) VALUES (?, ?, ?, ?, ?, ?)", [
        request.body.username,
        request.body.email,
        bcrypt.hashSync(request.body.password, 10),
        request.body.status,
        request.body.link_google || 0,
        request.body.link_facebook || 0
    ]);
}

// --------------------
// Read
// --------------------

/**
 * Retrieves a user from the database based on email and optionally validates the password.
 * 
 * This function queries the database for a user with the specified email. If a password 
 * is provided in the request, it checks if the provided password matches the stored hashed password. 
 * Additionally, it handles linked accounts (e.g., Google or Facebook).
 * 
 * @param {Object} request - The HTTP request object containing user login data.
 * @param {Object} request.body - The request body containing login credentials.
 * @param {string} request.body.email - The email address of the user to retrieve (required).
 * @param {string} [request.body.password] - The plaintext password to validate (optional).
 * @returns {Promise<Array|String>} An array containing user data if found and valid, or an empty string if not.
 */
export const loginUser = async (request) => {
    const userQuery = await pool.query("SELECT * FROM users WHERE email = ? AND deleted_at = NULL", [
        request.body.email
    ]);
    
    if (userQuery == "") {
        return "";
    }

    if (request.body.password) {
        const match = await bcrypt.compare(request.body.password, userQuery[0].password);
        return match ? userQuery : "";
    }

    if (userQuery[0].link_google == 1 || userQuery[0].link_facebook == 1) {
        return userQuery;
    }

    return "";
}

/**
 * Retrieves one or more users from the database based on specified parameters.
 * 
 * This function constructs a dynamic SQL query to fetch users from the `users` table. 
 * The query filters users based on the parameters provided in the request body. If no parameters 
 * are provided, all users (excluding soft-deleted ones) are returned.
 * 
 * @param {Object} request - The HTTP request object containing filter criteria.
 * @param {Object} request.body - The request body containing optional filter parameters.
 * @param {string} [request.body.id] - Filter by the user's ID (optional).
 * @param {string} [request.body.username] - Filter by the user's username (optional).
 * @param {string} [request.body.email] - Filter by the user's email address (optional).
 * @param {string} [request.body.status] - Filter by the user's status (optional).
 * @param {boolean} [request.body.link_google] - Filter by Google-linked accounts (optional).
 * @param {boolean} [request.body.link_facebook] - Filter by Facebook-linked accounts (optional).
 * @returns {Promise<Array>} A promise that resolves to an array of matching user records or an empty array if none match.
 */
export const readUser = async (request) => {
    let query = "SELECT * FROM users WHERE deleted_at = NULL"
    let params = [];
    
    if (request.body.id) {
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
 * This function retrieves a user by ID and updates their information with the data provided 
 * in the request body. Only the fields specified in the request body are updated; all others 
 * retain their current values.
 * 
 * @param {Object} request - The HTTP request object containing user update data.
 * @param {Object} request.body - The request body containing user update parameters.
 * @param {string} request.body.id - The ID of the user to update (required).
 * @param {string} [request.body.username] - The new username (optional).
 * @param {string} [request.body.email] - The new email address (optional).
 * @param {string} [request.body.password] - The new plaintext password (optional; hashed before storage).
 * @param {string} [request.body.status] - The new user status (optional).
 * @param {boolean} [request.body.link_google] - Whether the account is linked to Google (optional).
 * @param {boolean} [request.body.link_facebook] - Whether the account is linked to Facebook (optional).
 * @returns {Promise<Array|String>} A promise resolving to the updated user record as an array, 
 * or an empty string if the user with the specified ID does not exist.
 */
export const updateUser = async (request) => {
    const userQuery = await pool.query("SELECT * FROM users WHERE id = ? AND deleted_at = NULL", [
        request.body.id
    ]);
    
    if (userQuery == "") {
        return "";
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
 * to the current time. The user remains in the database but is treated as deleted.
 * 
 * @param {Object} request - The HTTP request object containing the user ID to delete.
 * @param {Object} request.body - The request body containing the deletion parameter.
 * @param {string} request.body.id - The ID of the user to delete (required).
 * @returns {Promise<Array>} A promise resolving to the result of the update query.
 */
export const deleteUser = async (request) => {
    return pool.query("UPDATE users SET deleted_at = NOW() WHERE id = ? AND deleted_at = NULL", [
        request.body.id
    ]);
}