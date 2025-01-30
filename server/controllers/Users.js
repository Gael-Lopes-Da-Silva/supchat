import bcrypt from "bcrypt";
import crypto from 'crypto';
import jwt from "jsonwebtoken";

import pool from "../database/db.js";

import { ERRORS, createErrorResponse } from "../app/ErrorHandler.js";
import { sendConfirmationEmail } from '../services/email/emailService.js';

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

    if (request.body.status_id) {
        const [status] = await pool.query("SELECT * FROM status WHERE id = ?", [request.body.status_id]);
        if (!status) return createErrorResponse(ERRORS.STATUS_NOT_FOUND);
    }

    const confirmToken = crypto.randomBytes(32).toString('hex');
    await sendConfirmationEmail(request.body.email, confirmToken);

    return pool.query("INSERT INTO users (username, email, password, status_id, confirm_token, reset_password_token) VALUES (?, ?, ?, ?, ?, ?)", [
        request.body.username,
        request.body.email,
        bcrypt.hashSync(request.body.password, 10),
        request.body.status_id || 1,
        request.body.confirm_token || confirmToken,
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

        if (request.query.status_id) {
            const [status] = await pool.query("SELECT * FROM status WHERE id = ?", [request.query.status_id]);
            if (!status) return createErrorResponse(ERRORS.STATUS_NOT_FOUND);
            where.push("status_id = ?");
            params.push(request.query.status_id);
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

    if (request.body.status_id) {
        const [status] = await pool.query("SELECT * FROM status WHERE id = ?", [request.body.status_id]);
        if (!status) return createErrorResponse(ERRORS.STATUS_NOT_FOUND);
    }

    return pool.query("UPDATE users SET username = ?, email = ?, password = ?, status_id = ?, link_google = ?, link_facebook = ?, confirm_token = ?, password_reset_token = ?, updated_at = NOW() WHERE id = ?", [
        request.body.username || user.username,
        request.body.email || user.email,
        request.body.password ? bcrypt.hashSync(request.body.password, 10) : user.password,
        request.body.status_id || user.status_id,
        request.body.link_google || user.link_google,
        request.body.link_facebook || user.link_facebook,
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

    const [user] = await pool.query("SELECT * FROM users WHERE email = ? AND provider = 'local'", [email]);
    if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
    if (user.confirm_token !== null) return createErrorResponse(ERRORS.USER_NOT_CONFIRMED);

    const match = await bcrypt.compare(password, user.password);
    if (!match) return createErrorResponse(ERRORS.WRONG_PASSWORD);

    return {
        token: jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" }),
        user: user,
    };
};

export const confirmUser = async (request) => {
    if (!request.body.token) return createErrorResponse(ERRORS.TOKEN_NOT_PROVIDED);

    const [user] = await pool.query('SELECT * FROM users WHERE confirm_token = ?', [request.body.confirm_token]);
    if (!user) return createErrorResponse(ERRORS.TOKEN_NOT_MATCHED);

    return pool.query('UPDATE users SET confirm_token = NULL WHERE id = ?', [user.id]);
};
