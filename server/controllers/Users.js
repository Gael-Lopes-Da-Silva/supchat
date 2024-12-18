import bcrypt from "bcrypt";
import pool from "../database/db.js";

// --------------------
// Create
// --------------------

export const createUser = async (request) => {
    pool.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [
        request.body.username,
        request.body.email,
        bcrypt.hashSync(request.body.password, 10)
    ]);
}

// --------------------
// Read
// --------------------

export const loginUser = async (request) => {
    const result = await pool.query("SELECT * FROM users WHERE email = ? AND deleted_at = NULL", [
        request.body.email
    ]);

    const match = result !== "" ? await bcrypt.compare(request.body.password, result[0].password) : false;

    return match ? result : "";
}

export const loginUserWithoutPassword = async (request) => {
    const result = await pool.query("SELECT * FROM users WHERE email = ? AND deleted_at = NULL", [
        request.body.email
    ]);

    if (result === "") return "";

    if (result[0].link_google == 1 || result[0].link_facebook == 1) return result;

    return "";
}

export const getUserById = async (request) => {
    return pool.query("SELECT * FROM users WHERE id = ? AND deleted_at = NULL", [
        request.body.id
    ]);
}

export const getUserByEmail = async (request) => {
    return pool.query("SELECT * FROM users WHERE email = ? AND deleted_at = NULL", [
        request.body.email
    ]);
}

export const getAllUsers = async (request) => {
    return pool.query("SELECT * FROM users WHERE deleted_at = NULL");
}

// --------------------
// Update
// --------------------

export const updateUser = async (request) => {
    return pool.query("UPDATE users SET username = ?, email = ?, password = ?, updated_at = NOW() WHERE id = ? AND deleted_at = NULL", [
        request.body.username,
        request.body.email,
        bcrypt.hashSync(request.body.password, 10),
        request.body.id
    ]);
}

export const linkUserGoogle = async (request) => {
    return pool.query("UPDATE users SET link_google = ? WHERE id = ? AND deleted_at = NULL", [
        request.body.link_google,
        request.body.id
    ]);
}

export const linkUserFacebook = async (request) => {
    return pool.query("UPDATE users SET link_facebook = ? WHERE id = ? AND deleted_at = NULL", [
        request.body.link_facebook,
        request.body.id
    ]);
}

// --------------------
// Delete
// --------------------

export const deleteUser = async (request) => {
    return pool.query("UPDATE users SET deleted_at = NOW() WHERE id = ? AND deleted_at = NULL", [
        request.body.id
    ]);
}