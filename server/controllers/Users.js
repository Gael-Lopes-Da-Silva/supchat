import bcrypt from "bcrypt";
import pool from "../database/db.js";

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

        if (!status) return {
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

export const loginUser = async (request) => {
    if (!request.body.email) return {
        error: 1,
        error_message: "Email not provided"
    };

    const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [
        request.body.email
    ]);

    if (!user) return {
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
    if (request.params.id) {
        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
            request.params.id
        ]);

        if (!user) return {
            error: 1,
            error_message: "User not found"
        };
        
        return user;
    } else {
        let query = "SELECT * FROM users"
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
            const [status] = await pool.query("SELECT * FROM status WHERE id = ?", [
                request.query.status_id
            ]);

            if (!status) {
                return {
                    error: 1,
                    error_message: "Status not found"
                };
            };

            where.push("status_id = ?");
            params.push(request.query.status_id);
        }

        if (request.query.link_google) {
            if (request.query.link_google != "true" && request.query.link_google != "false") return {
                error: 1,
                error_message: "Link_google should be a boolean"
            };

            where.push("link_google = ?");
            params.push(request.query.link_google === "true");
        }

        if (request.query.link_facebook) {
            if (request.query.link_facebook != "true" && request.query.link_facebook != "false") return {
                error: 1,
                error_message: "Link_facebook should be a boolean"
            };

            where.push("link_facebook = ?");
            params.push(request.query.link_facebook === "true");
        }

        if (where > 0) {
            query += " WHERE " + where.join(" AND ");
        }

        return pool.query(query, params);
    }
}

export const updateUser = async (request) => {
    if (!request.params.id) return {
        error: 1,
        error_message: "Id not provided"
    };

    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
        request.params.id
    ]);

    if (!user) return {
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

        if (!status) return {
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
        request.params.id
    ]);
}

export const deleteUser = async (request) => {
    if (!request.params.id) return {
        error: 1,
        error_message: "Id not provided"
    };

    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
        request.params.id
    ]);

    if (!user) return {
        error: 1,
        error_message: "User not found"
    };

    if (user.deleted_at != null) return {
        error: 1,
        error_message: "User already deleted"
    };

    return pool.query("UPDATE users SET deleted_at = NOW() WHERE id = ?", [
        request.params.id
    ]);
}

export const restoreUser = async (request) => {
    if (!request.params.id) return {
        error: 1,
        error_message: "Id not provided"
    };

    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
        request.params.id
    ]);

    if (!user) return {
        error: 1,
        error_message: "User not found"
    };

    if (user.deleted_at == null) return {
        error: 1,
        error_message: "User not deleted"
    };

    return pool.query("UPDATE users SET deleted_at = NULL WHERE id = ?", [
        request.params.id
    ]);
}