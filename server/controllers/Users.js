import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import pool from "../database/db.js";
import { ERRORS, createErrorResponse } from "../app/ErrorHandler.js";

export const createUser = async (request) => {
  try {
      const { username, email, password } = request.body;

      if (!username) return createErrorResponse(ERRORS.USERNAME_NOT_PROVIDED);
      if (!email) return createErrorResponse(ERRORS.EMAIL_NOT_PROVIDED);
      if (!password) return createErrorResponse(ERRORS.PASSWORD_NOT_PROVIDED);

      const [existingEmail] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
      if (existingEmail) return createErrorResponse(ERRORS.EMAIL_ALREADY_USED);

      const [existingUsername] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
      if (existingUsername) return createErrorResponse(ERRORS.USERNAME_ALREADY_USED);

      const hashedPassword = bcrypt.hashSync(password, 10);

      const result = await pool.query(
          "INSERT INTO users (username, email, password, status_id) VALUES (?, ?, ?, ?)",
          [username, email, hashedPassword,2] // obligé d'envoyer le status en bdd pour l'instant on verra après
      );

      return { error: 0, result };
  } catch (error) {
      console.error("Error createUser:", error.message);
      throw error;
  }
};



export const loginUser = async (req) => {
  const { email, password } = req.body;

  if (!email) {
    return createErrorResponse(ERRORS.EMAIL_NOT_PROVIDED);
  }

  if (!password) {
    return createErrorResponse(ERRORS.PASSWORD_NOT_PROVIDED);
  }

  try {
    const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) {
      return createErrorResponse(ERRORS.USER_NOT_FOUND);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return createErrorResponse(ERRORS.WRONG_PASSWORD);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, status: user.status_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      error: 0,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        status: user.status_id,
        provider: user.provider,
      },
    };
  } catch (err) {
    console.error("Erreur lors de la connexion :", err.message);
    return createErrorResponse(ERRORS.INTERNAL_SERVER_ERROR);
  }
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

        if (request.query.link_google) {
            where.push("link_google = ?");
            params.push(request.query.link_google);
        }

        if (request.query.link_facebook) {
            where.push("link_facebook = ?");
            params.push(request.query.link_facebook);
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