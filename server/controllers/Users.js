import bcrypt from "bcrypt";
import pool from "../database/db.js";

export const createUser = async (request) => {
    pool.query("INSERT INTO users (username, email, password, link_google, link_facebook) VALUES (?, ?, ?, ?, ?)", [
        request.body.username,
        request.body.email,
        bcrypt.hashSync(request.body.password, 10),
        request.body.google,
        request.body.facebook,
    ]);
}

export const deleteUser = async (request) => {
    return pool.query("UPDATE users SET deleted_at = NOW() WHERE id = ?", [
        request.body.id,
    ]);
}

export const updateUser = async (request) => {
    return pool.query("UPDATE users SET username = ?, email = ?, password = ?, link_google = ?, link_facebook = ?, updated_at = NOW() WHERE id = ?", [
        request.body.username,
        request.body.email,
        request.body.google,
        request.body.facebook,
        bcrypt.hashSync(request.body.password, 10),
        request.body.id,
    ]);
}

export const loginUser = async (request) => {
    const result = await pool.query("SELECT * FROM users WHERE email = ?", [
        request.body.email
    ]);
    
    const match = result !== "" ? await bcrypt.compare(request.body.password, result[0].password) : false;
    
    return match ? result : "";
}

export const getUser = async (request) => {
    return pool.query("SELECT * FROM users WHERE id = ?", [
        request.body.id,
    ]);
}

export const getUserByEmail = async (request) => {
    return pool.query("SELECT * FROM users WHERE email = ?", [
        request.body.email,
    ]);
}

export const getAllUser = async (request) => {
    return pool.query("SELECT * FROM users");
}