import bcrypt from "bcrypt";
import pool from "../database/db.js";

export const createUser = async (request) => {
    pool.query("INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())", [
        request.body.username,
        request.body.email,
        bcrypt.hashSync(request.body.password, 10)
    ]);
}

export const deleteUser = async (request) => {
    pool.query("UPDATE users SET created_at = NOW() WHERE id = ?", [
        request.body.id,
    ]);
}