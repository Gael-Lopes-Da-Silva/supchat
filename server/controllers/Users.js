import bcrypt from "bcrypt";
import crypto from 'crypto';
import jwt from "jsonwebtoken";

import pool from "../database/db.js";

import { ERRORS, createErrorResponse } from "../app/ErrorHandler.js";

export const createUser = async (request) => {
    if (!request.body.username) return createErrorResponse(ERRORS.USERNAME_NOT_PROVIDED);
    if (!request.body.email) return createErrorResponse(ERRORS.EMAIL_NOT_PROVIDED);
    if (!request.body.password) return createErrorResponse(ERRORS.PASSWORD_NOT_PROVIDED);

    if (request.body.username) {
        const [user] = await pool.query("SELECT * FROM users WHERE username = ? AND provider = 'local'", [request.body.username]);
        if (user) return createErrorResponse(ERRORS.USERNAME_ALREADY_USED);
    }

    if (request.body.email) {
        const [user] = await pool.query("SELECT * FROM users WHERE email = ? AND provider = 'local'", [request.body.email]);
        if (user) return createErrorResponse(ERRORS.EMAIL_ALREADY_USED);
    }

    return pool.query("INSERT INTO users (username, email, password, confirm_token, password_reset_token) VALUES (?, ?, ?, ?, ?)", [
        request.body.username,
        request.body.email,
        bcrypt.hashSync(request.body.password, 10),
        request.body.confirm_token || crypto.randomBytes(32).toString('hex'),
        request.body.password_reset_token || null,
    ]);
};

export const readUser = async (request) => {
    if (request.params.id) {
        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.params.id]);
        if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
        return user;
    } else {
        let query = "SELECT * FROM users";
        let where = [];
        let params = [];

        if (request.query.username) {
            where.push("username = ?");
            params.push(request.query.username);
        }

        if (request.query.email) {
            where.push("email = ?");
            params.push(request.query.email);
        }

        if (request.query.confirm_token) {
            where.push("confirm_token = ?");
            params.push(request.query.confirm_token);
        }

        if (request.query.password_reset_token) {
            where.push("password_reset_token = ?");
            params.push(request.query.password_reset_token);
        }

        if (where.length > 0) {
            query += " WHERE " + where.join(" AND ");
        }

        return pool.query(query, params);
    }
}

export const updateUser = async (request) => {
    if (!request.params.id) return createErrorResponse(ERRORS.ID_NOT_PROVIDED);

    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.params.id]);
    if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
    if (user.deleted_at !== null) return createErrorResponse(ERRORS.USER_DELETED);
    
    if (request.body.password_reset_token === "random") {
        request.body.password_reset_token = crypto.randomBytes(32).toString('hex');
    }

    return pool.query("UPDATE users SET username = ?, email = ?, password = ?, confirm_token = ?, password_reset_token = ?, updated_at = NOW() WHERE id = ?", [
        request.body.username || user.username,
        request.body.email || user.email,
        request.body.password ? bcrypt.hashSync(request.body.password, 10) : user.password,
        request.body.confirm_token !== undefined ? request.body.confirm_token : user.confirm_token,
        request.body.password_reset_token !== undefined ? request.body.password_reset_token : user.password_reset_token,
        request.params.id
    ]);
}

export const deleteUser = async (request) => {
    if (!request.params.id) return createErrorResponse(ERRORS.ID_NOT_PROVIDED);

    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.params.id]);
    if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
    if (user.deleted_at !== null) return createErrorResponse(ERRORS.USER_ALREADY_DELETED);

    return pool.query("UPDATE users SET deleted_at = NOW() WHERE id = ?", [request.params.id]);
}

export const restoreUser = async (request) => {
    if (!request.params.id) return createErrorResponse(ERRORS.ID_NOT_PROVIDED);

    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.params.id]);
    if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
    if (user.deleted_at === null) return createErrorResponse(ERRORS.USER_NOT_DELETED);

    return pool.query("UPDATE users SET deleted_at = NULL WHERE id = ?", [request.params.id]);
}


export const loginUser = async (request) => {
    if (!request.body.email) return createErrorResponse(ERRORS.EMAIL_NOT_PROVIDED);
    if (!request.body.password) return createErrorResponse(ERRORS.PASSWORD_NOT_PROVIDED);

    const [user] = await pool.query("SELECT * FROM users WHERE email = ? AND provider = 'local'", [request.body.email]);
    if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
    if (user.confirm_token !== null) return createErrorResponse(ERRORS.USER_NOT_CONFIRMED);

    const match = await bcrypt.compare(request.body.password, user.password);
    if (!match) return createErrorResponse(ERRORS.WRONG_PASSWORD);

    return {
        token: jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" }),
        user: user,
    };
};
