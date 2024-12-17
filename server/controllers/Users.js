import bcrypt from "bcrypt";
import pool from "../database/db.js";

export const createUser = async (request) => {
    pool.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [
        request.body.username,
        request.body.email,
        bcrypt.hashSync(request.body.password, 10)
    ]);
}

export const deleteUser = async (request) => {
    return pool.query("UPDATE users SET deleted_at = NOW() WHERE id = ?", [
        request.body.id,
    ]);
}

export const updateUser = async (request) => {
    return pool.query("UPDATE users SET username = ?, email = ?, password = ?, updated_at = NOW() WHERE id = ?", [
        request.body.username,
        request.body.email,
        bcrypt.hashSync(request.body.password, 10),
        request.body.id,
    ]);
}

export const loginUser = async (request) => {
    const result = await pool.query("SELECT * FROM users WHERE email = ?", [
        request.body.email
    ]);
    
    const match = await bcrypt.compare(request.body.password, result[0].password);
    if (!match) {
        return "";
    }
    
    return result;
}