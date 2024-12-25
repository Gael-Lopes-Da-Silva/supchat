import pool from "../database/db.js";

// --------------------
// Create
// --------------------

export const createRolePermission = async (request) => {
    if (!request.body.role_id) return {
        error: 1,
        error_message: "Role_id not provided"
    };

    if (!request.body.permission_id) return {
        error: 1,
        error_message: "Permission_id not provided"
    };

    if (request.body.role_id) {
        const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [
            request.body.role_id
        ]);

        if (!role) return {
            error: 1,
            error_message: "Role not found"
        };
    }
    
    if (request.body.permission_id) {
        const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [
            request.body.permission_id
        ]);

        if (!permission) return {
            error: 1,
            error_message: "Permission not found"
        };
    }

    return pool.query("INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)", [
        request.body.role_id,
        request.body.permission_id
    ]);
}

// --------------------
// Read
// --------------------

export const readRolePermission = async (request) => {
    let query = "SELECT * FROM role_permissions"
    let where = [];
    let params = [];

    if (request.body.role_id) {
        const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [
            request.body.role_id
        ]);

        if (!role) {
            return {
                error: 1,
                error_message: "Role not found"
            };
        };

        where.push("role_id = ?");
        params.push(request.body.role_id);
    }
    
    if (request.body.permission_id) {
        const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [
            request.body.permission_id
        ]);

        if (!permission) {
            return {
                error: 1,
                error_message: "Permission not found"
            };
        };

        where.push("permission_id = ?");
        params.push(request.body.permission_id);
    }

    if (where > 0) {
        query += " WHERE " + where.join(" AND ");
    }

    return pool.query(query, params);
}

// --------------------
// Update
// --------------------

// Use Add and Delete to update

// --------------------
// Delete
// --------------------

export const deleteRolePermission = async (request) => {
    if (!request.body.role_id) return {
        error: 1,
        error_message: "Role_id not provided"
    };

    if (!request.body.permission_id) return {
        error: 1,
        error_message: "Permission_id not provided"
    };
    
    if (request.body.role_id) {
        const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [
            request.body.role_id
        ]);

        if (!role) {
            return {
                error: 1,
                error_message: "Role not found"
            };
        };
    }
    
    if (request.body.permission_id) {
        const [permission] = await pool.query("SELECT * FROM permissions WHERE id = ?", [
            request.body.permission_id
        ]);

        if (!permission) {
            return {
                error: 1,
                error_message: "Permission not found"
            };
        };
    }

    return pool.query("DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?", [
        request.body.role_id,
        request.body.permission_id
    ]);
}