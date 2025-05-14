import pool from "../database/db.js";
import { ERRORS, createErrorResponse } from "../app/ErrorHandler.js";

export const createWorkspace = async (request, io = null) => {
    if (!request.body.name) return createErrorResponse(ERRORS.NAME_NOT_PROVIDED);
    if (!request.body.user_id) return createErrorResponse(ERRORS.USER_ID_NOT_PROVIDED);

    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.body.user_id]);
    if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
    if (user.deleted_at !== null) return createErrorResponse(ERRORS.USER_DELETED);

    const result = await pool.query(
        "INSERT INTO workspaces (name, description, is_private, user_id) VALUES (?, ?, ?, ?)",
        [
            request.body.name,
            request.body.description || "",
            request.body.is_private || false,
            request.body.user_id
        ]
    );

    const newWorkspaceId = result.insertId;

    const roleId = 2; 

    const [existingMember] = await pool.query(
        "SELECT * FROM workspace_members WHERE workspace_id = ? AND user_id = ?",
        [newWorkspaceId, request.body.user_id]
    );

    if (!existingMember || existingMember.length === 0) {
        await pool.query(
            "INSERT INTO workspace_members (workspace_id, user_id, role_id) VALUES (?, ?, ?)",
            [newWorkspaceId, request.body.user_id, roleId]
        );
    }

    const newWorkspace = {
        id: newWorkspaceId,
        name: request.body.name,
        description: request.body.description || "",
        is_private: request.body.is_private || false,
        user_id: request.body.user_id,
    };

    if (io && request.socket) {
        // envoi la notif à tout le monde sauf l'auteur (osef de recevoir une notif de notre propre création on sait cquon fait..)
        request.socket.broadcast.emit('publicWorkspaceCreated', newWorkspace);
    
        // pour mettre à jour en temps reel le ws qui vient d'être cree dans la sidebar. 
        // côté front On va listen cet emit pour refetch la workspacelist. PS : ça c'est pour du créateur du ws
        io.to(`user_${request.body.user_id}`).emit('workspaceCreated', newWorkspace); 
    }
    
    return newWorkspace;
    

};


export const readWorkspace = async (request) => {
    if (request.params.id) {
        const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.params.id]);
        if (!workspace) return createErrorResponse(ERRORS.WORKSPACE_NOT_FOUND);
        return workspace;
    } else {
        let query = "SELECT * FROM workspaces"
        let where = [];
        let params = [];

        if (request.query.name) {
            where.push("name = ?");
            params.push(request.query.name);
        }

        if (request.query.description) {
            where.push("description = ?");
            params.push(request.query.description);
        }

        if (request.query.is_private) {
            where.push("is_private = ?");
            params.push(request.query.is_private);
        }

        if (request.query.user_id) {
            const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.query.user_id]);
            if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
            where.push("user_id = ?");
            params.push(request.query.user_id);
        }

        if (where.length > 0) {
            query += " WHERE " + where.join(" AND ");
        }

        return pool.query(query, params);
    }
};

export const updateWorkspace = async (request) => {
    if (!request.params.id) return createErrorResponse(ERRORS.ID_NOT_PROVIDED);

    const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.params.id]);
    if (!workspace) return createErrorResponse(ERRORS.WORKSPACE_NOT_FOUND);
    if (workspace.deleted_at !== null) return createErrorResponse(ERRORS.WORKSPACE_DELETED);

    if (request.body.user_id) {
        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.body.user_id]);
        if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
        if (user.deleted_at !== null) return createErrorResponse(ERRORS.USER_DELETED);
    }

    return pool.query("UPDATE workspaces SET name = ?, description = ?, is_private = ?, user_id = ?, updated_at = NOW() WHERE id = ?", [
        request.body.name || workspace.name,
        request.body.description || workspace.description,
        request.body.is_private || workspace.is_private,
        request.body.user_id || workspace.user_id,
        request.params.id
    ]);
};

export const deleteWorkspace = async (request) => {
    if (!request.params.id) return createErrorResponse(ERRORS.ID_NOT_PROVIDED);

    const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.params.id]);
    if (!workspace) return createErrorResponse(ERRORS.WORKSPACE_NOT_FOUND);
    if (workspace.deleted_at !== null) return createErrorResponse(ERRORS.WORKSPACE_ALREADY_DELETED);

    return pool.query("UPDATE workspaces SET deleted_at = NOW() WHERE id = ?", [request.params.id]);
};

export const restoreWorkspace = async (request) => {
    if (!request.params.id) return createErrorResponse(ERRORS.ID_NOT_PROVIDED);

    const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.params.id]);
    if (!workspace) return createErrorResponse(ERRORS.WORKSPACE_NOT_FOUND);
    if (workspace.deleted_at === null) return createErrorResponse(ERRORS.WORKSPACE_NOT_DELETED);

    return pool.query("UPDATE workspaces SET deleted_at = NULL WHERE id = ?", [request.params.id]);
};

export const readUserWorkspaces = async ({ user_id }) => {
    try {
        if (!user_id) return createErrorResponse(ERRORS.USER_ID_NOT_PROVIDED);

        
        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [user_id]);
        if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);

        
        const members = await pool.query(
            "SELECT workspace_id FROM workspace_members WHERE user_id = ?",
            [user_id]
        );

        const workspaceIds = members.map((row) => row.workspace_id);
        if (workspaceIds.length === 0) return { result: [], error: 0 };

        const placeholders = workspaceIds.map(() => "?").join(",");
        const workspaces = await pool.query(
            `SELECT * FROM workspaces WHERE id IN (${placeholders})`,
            workspaceIds
        );

        return { result: workspaces, error: 0 };

    } catch (error) {
        console.error("Erreur readUserWorkspaces:", error);
        return createErrorResponse({ code: 500, message: error.message });
    }
};


export const readPublicWorkspaces = async (request) => {
    try {
        const rows = await pool.query(
            "SELECT id, name, description, is_private FROM workspaces WHERE is_private = 0"
        );

        return rows;
    } catch (error) {
        console.error("Erreur dans readPublicWorkspaces:", error);
        return { error: 1, error_message: "Erreur lors de la récupération des workspaces publics." };
    }
};

export const joinWorkspace = async ({ workspace_id, user_id }, io = null) => {
    try {
        const rows = await pool.query(
            "SELECT * FROM workspaces WHERE id = ?",
            [workspace_id]
        );

        if (!rows || rows.length === 0) {
            throw new Error("Workspace introuvable.");
        }

        const workspace = rows[0];

        const existingMemberships = await pool.query(
            "SELECT 1 FROM workspace_members WHERE workspace_id = ? AND user_id = ?",
            [workspace_id, user_id]
        );

        const isAlreadyMember = existingMemberships.length > 0;

        if (workspace.is_private && !isAlreadyMember) {
            throw new Error("Ce workspace est privé. Invitation requise.");
        }

        if (!workspace.is_private && !isAlreadyMember) {
            await pool.query(
                `INSERT INTO workspace_members (workspace_id, user_id, role_id)
                 VALUES (?, ?, (SELECT id FROM roles WHERE name = 'member'))`,
                [workspace_id, user_id]
            );
        }

        const channels = await pool.query(
            "SELECT * FROM channels WHERE workspace_id = ?",
            [workspace_id]
        );

        return { workspace, channels, isAlreadyMember };

    } catch (error) {
        console.error("Erreur joinWorkspace:", error);
        return {
            error: true,
            error_message: error.message || "Erreur inconnue lors de la tentative de rejoindre le workspace."
        };
    }
};

