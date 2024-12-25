import bcrypt from "bcrypt";
import pool from "../database/db.js";

// --------------------
// Create
// --------------------

export const createUser = async (request) => {
    if (!request.body.username) return {
        error: 1,
        error_message: "Username not provided"
    };

    if (!request.body.email) return {
        error: 1,
        error_message: "Email not provided"
    };

    if (!request.body.password) return {
        error: 1,
        error_message: "Password not provided"
    };

    if (request.body.status_id) {
        const [status] = await pool.query("SELECT * FROM status WHERE id = ?", [
            request.body.status_id
        ]);

        if (!status.length) return {
            error: 1,
            error_message: "Status not found"
        };
    }

    if (request.body.link_google && request.body.link_google != "true" && request.body.link_google != "false") return {
        error: 1,
        error_message: "Link_google should be a boolean"
    };

    if (request.body.link_facebook && request.body.link_facebook != "true" && request.body.link_facebook != "false") return {
        error: 1,
        error_message: "Link_facebook should be a boolean"
    };

    return pool.query("INSERT INTO users (username, email, password, status_id, link_google, link_facebook) VALUES (?, ?, ?, ?, ?, ?)", [
        request.body.username,
        request.body.email,
        bcrypt.hashSync(request.body.password, 10),
        request.body.status_id || 1,
        request.body.link_google ? request.body.link_google === "true" : false,
        request.body.link_facebook ? request.body.link_facebook === "true" : false
    ]);
}

// --------------------
// Read
// --------------------

export const loginUser = async (request) => {
    if (!request.body.email) return {
        error: 1,
        error_message: "Email not provided"
    };

    const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [
        request.body.email
    ]);

    if (!user.length) return {
        error: 1,
        error_message: "User not found"
    };

    if (request.body.password) {
        const match = await bcrypt.compare(request.body.password, user.password);
        return match ? user : {
            error: 1,
            error_message: "Wrong password"
        };
    }

    return (user.link_google == 1 || user.link_facebook == 1) ? user : {
        error: 1,
        error_message: "User not linked to any socials"
    };
}

export const readUser = async (request) => {
    let query = "SELECT * FROM users"
    let where = [];
    let params = [];

    if (request.body.id) {
        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
            request.body.id
        ]);

        if (!user.length) return {
            error: 1,
            error_message: "User not found"
        };

        where.push("id = ?");
        params.push(request.body.id);
    }

    if (request.body.username) {
        where.push("username = ?");
        params.push(request.body.username);
    }

    if (request.body.email) {
        where.push("email = ?");
        params.push(request.body.email);
    }

    if (request.body.status_id) {
        const [status] = await pool.query("SELECT * FROM status WHERE id = ?", [
            request.body.status_id
        ]);

        if (!status.length) {
            return {
                error: 1,
                error_message: "Status not found"
            };
        };

        where.push("status_id = ?");
        params.push(request.body.status_id);
    }

    if (request.body.link_google) {
        if (request.body.link_google != "true" && request.body.link_google != "false") return {
            error: 1,
            error_message: "Link_google should be a boolean"
        };

        where.push("link_google = ?");
        params.push(request.body.link_google === "true");
    }

    if (request.body.link_facebook) {
        if (request.body.link_facebook != "true" && request.body.link_facebook != "false") return {
            error: 1,
            error_message: "Link_facebook should be a boolean"
        };

        where.push("link_facebook = ?");
        params.push(request.body.link_facebook === "true");
    }

    if (where.length > 0) {
        query += " WHERE " + where.join(" AND ");
    }

    return pool.query(query, params);
}

// --------------------
// Update
// --------------------

export const updateUser = async (request) => {
    if (!request.body.id) return {
        error: 1,
        error_message: "Id not provided"
    };

    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
        request.body.id
    ]);

    if (!user.length) return {
        error: 1,
        error_message: "User not found"
    };

    if (user.deleted_at != null) return {
        error: 1,
        error_message: "User deleted"
    };

    if (request.body.status_id) {
        const [status] = await pool.query("SELECT * FROM status WHERE id = ?", [
            request.body.status_id
        ]);

        if (!status.length) return {
            error: 1,
            error_message: "Status not found"
        };
    }

    if (request.body.link_google && request.body.link_google != "true" && request.body.link_google != "false") return {
        error: 1,
        error_message: "Link_google should be a boolean"
    };

    if (request.body.link_facebook && request.body.link_facebook != "true" && request.body.link_facebook != "false") return {
        error: 1,
        error_message: "Link_facebook should be a boolean"
    };

    return pool.query("UPDATE users SET username = ?, email = ?, password = ?, status_id = ?, link_google = ?, link_facebook = ?, updated_at = NOW() WHERE id = ?", [
        request.body.username || userQuery[0].username,
        request.body.email || userQuery[0].email,
        request.body.password ? bcrypt.hashSync(request.body.password, 10) : userQuery[0].password,
        request.body.status_id || userQuery[0].status_id,
        request.body.link_google ? request.body.link_google === "true" : userQuery[0].link_google,
        request.body.link_facebook ? request.body.link_facebook === "true" : userQuery[0].link_facebook,
        request.body.id
    ]);
}

// --------------------
// Delete
// --------------------

export const deleteUser = async (request) => {
    if (!request.body.id) return {
        error: 1,
        error_message: "Id not provided"
    };

    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
        request.body.id
    ]);

    if (!user.length) return {
        error: 1,
        error_message: "User not found"
    };

    if (user.deleted_at != null) return {
        error: 1,
        error_message: "User already deleted"
    };

    return pool.query("UPDATE users SET deleted_at = NOW() WHERE id = ?", [
        request.body.id
    ]);
}

export const restoreUser = async (request) => {
    if (!request.body.id) return {
        error: 1,
        error_message: "Id not provided"
    };

    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
        request.body.id
    ]);

    if (!user.length) return {
        error: 1,
        error_message: "User not found"
    };

    if (user.deleted_at == null) return {
        error: 1,
        error_message: "User not deleted"
    };

    return pool.query("UPDATE users SET deleted_at = NULL WHERE id = ?", [
        request.body.id
    ]);
}