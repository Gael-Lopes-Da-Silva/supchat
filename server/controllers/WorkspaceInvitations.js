import pool from "../database/db.js";
import { ERRORS, createErrorResponse } from "../app/ErrorHandler.js";
import { v4 as uuidv4 } from 'uuid';
import { createWorkspaceMember } from "./WorkspaceMembers.js";

export const createWorkspaceInvitation = async (request) => {
    try {
        if (!request.body.user_id) return createErrorResponse(ERRORS.USER_ID_NOT_PROVIDED);
        if (!request.body.workspace_id) return createErrorResponse(ERRORS.WORKSPACE_ID_NOT_PROVIDED);

        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.body.user_id]);
        if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
        if (user.deleted_at !== null) return createErrorResponse(ERRORS.USER_DELETED);

        const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.body.workspace_id]);
        if (!workspace) return createErrorResponse(ERRORS.WORKSPACE_NOT_FOUND);
        if (workspace.deleted_at !== null) return createErrorResponse(ERRORS.WORKSPACE_DELETED);

        const token = uuidv4();

        const result = await pool.query(
            "INSERT INTO workspace_invitations (user_id, workspace_id, token, maximum_use, used_by, expire_at) VALUES (?, ?, ?, ?, ?, ?)",
            [
                request.body.user_id,
                request.body.workspace_id,
                token,
                request.body.maximum_use || null,
                request.body.used_by || 0,
                request.body.expire_at || null,
            ]
        );

        const response = {
            result: {
                insertId: result.insertId,
                token: token
            },
            error: 0
        };

        console.log("Response being sent:", response);
        return response;
    } catch (error) {
        console.error("Error creating workspace invitation:", error);
        return createErrorResponse({ error: 1, error_message: error.message });
    }
};



export const readWorkspaceInvitation = async (request) => {
    try {
        if (request.params && request.params.id) {
            const [rows] = await pool.query("SELECT * FROM workspace_invitations WHERE id = ?", [request.params.id]);
            if (!rows || rows.length === 0) {
                return createErrorResponse(ERRORS.WORKSPACE_INVITATION_NOT_FOUND);
            }
            const result = rows[0];

            return result;
        } else {
            let query = "SELECT * FROM workspace_invitations";
            let where = [];
            let params = [];

            if (request.query && request.query.user_id) {
                const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.query.user_id]);
                if (!user || user.length === 0) return createErrorResponse(ERRORS.USER_NOT_FOUND);
                where.push("user_id = ?");
                params.push(request.query.user_id);
            }

            if (request.query && request.query.workspace_id) {
                const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.query.workspace_id]);
                if (!workspace || workspace.length === 0) return createErrorResponse(ERRORS.WORKSPACE_NOT_FOUND);
                where.push("workspace_id = ?");
                params.push(request.query.workspace_id);
            }

            if (request.query && request.query.token) {
                where.push("token = ?");
                params.push(request.query.token);
            }

            if (request.query && request.query.maximum_use) {
                where.push("maximum_use = ?");
                params.push(request.query.maximum_use);
            }

            if (request.query && request.query.used_by) {
                where.push("used_by = ?");
                params.push(request.query.used_by);
            }

            if (request.query && request.query.expire_at) {
                where.push("expire_at = ?");
                params.push(request.query.expire_at);
            }

            if (where.length > 0) {
                query += " WHERE " + where.join(" AND ");
            }

            const [rows] = await pool.query(query, params);

            const result = rows;

            return result;
        }
    } catch (error) {
        console.error("Error reading workspace invitation:", error);
        return createErrorResponse({ error: 1, error_message: error.message });
    }
};



export const joinWorkspaceWithInvitation = async (requestOrData) => {
    try {

        const data = requestOrData?.body || requestOrData;
        const { token, user_id } = data;

        if (!token || !user_id) {
            return createErrorResponse({ code: 400, message: "Invalid input" });
        }

        const invitation = await readWorkspaceInvitation({ query: { token } });

        if (!invitation || invitation.error) {
            return createErrorResponse({ code: 404, message: "Invitation not found" });
        }

        if (invitation.maximum_use !== null && invitation.used_by >= invitation.maximum_use) {
            return createErrorResponse({ code: 403, message: "Invitation has reached maximum usage" });
        }


        await pool.query(
            "UPDATE workspace_invitations SET used_by = ? WHERE token = ?",
            [user_id, token]
        );

        const [roles] = await pool.query("SELECT id FROM roles WHERE name = 'member'");
        const role_id = roles.id;

        if (!role_id) {
            return createErrorResponse({ code: 500, message: "Role not found" });
        }

        await createWorkspaceMember({
            body: {
                user_id,
                workspace_id: invitation.workspace_id,
                role_id
            }
        });


        return {
            result: { workspace_id: invitation.workspace_id },
            error: 0
        };
    } catch (error) {
        console.error("Error joining workspace with invitation:", error);
        return createErrorResponse({ code: 500, message: error.message });
    }
};



export const updateWorkspaceInvitation = async (request) => {
    if (!request.params.id) return createErrorResponse(ERRORS.ID_NOT_PROVIDED);

    const [workspaceInvitation] = await pool.query("SELECT * FROM workspace_invitations WHERE id = ?", [request.params.id]);
    if (!workspaceInvitation) return createErrorResponse(ERRORS.WORKSPACE_INVITATION_NOT_FOUND);
    if (workspaceInvitation.deleted_at !== null) return createErrorResponse(ERRORS.WORKSPACE_INVITATION_DELETED);

    if (request.body.user_id) {
        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.body.user_id]);
        if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
        if (user.deleted_at !== null) return createErrorResponse(ERRORS.USER_DELETED);
    }

    if (request.body.workspace_id) {
        const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.body.workspace_id]);
        if (!workspace) return createErrorResponse(ERRORS.WORKSPACE_NOT_FOUND);
        if (workspace.deleted_at !== null) return createErrorResponse(ERRORS.WORKSPACE_DELETED);
    }

    if (request.body.token) {
        const [token] = await pool.query("SELECT * FROM workspace_invitations WHERE token = ?", [request.body.token]);
        if (token) return createErrorResponse(ERRORS.TOKEN_NOT_UNIQUE);
    }

    return pool.query("UPDATE workspace_members SET user_id = ?, workspace_id = ?, token = ?, maximum_user = ?, used_by = ?, expire_at = ? WHERE id = ?", [
        request.body.user_id || workspaceInvitation.user_id,
        request.body.workspace_id || workspaceInvitation.workspace_id,
        request.body.token || workspaceInvitation.token,
        request.body.maximum_use !== undefined ? request.body.maximum_use : workspaceInvitation.maximum_use,
        request.body.used_by || workspaceInvitation.used_by,
        request.body.expire_at !== undefined ? request.body.expire_at : workspaceInvitation.expire_at,
        request.params.id
    ]);
};

export const deleteWorkspaceInvitation = async (request) => {
    if (!request.params.id) return createErrorResponse(ERRORS.ID_NOT_PROVIDED);

    const [workspaceInvitation] = await pool.query("SELECT * FROM workspace_invitations WHERE id = ?", [request.params.id]);
    if (!workspaceInvitation) return createErrorResponse(ERRORS.WORKSPACE_INVITATION_NOT_FOUND);
    if (workspaceInvitation.deleted_at !== null) return createErrorResponse(ERRORS.WORKSPACE_INVITATION_ALREADY_DELETED);

    return pool.query("UPDATE workspace_invitations SET deleted_at = NOW() WHERE id = ?", [request.params.id]);
};

export const restoreWorkspaceInvitation = async (request) => {
    if (!request.params.id) return createErrorResponse(ERRORS.ID_NOT_PROVIDED);

    const [workspaceInvitation] = await pool.query("SELECT * FROM workspace_invitations WHERE id = ?", [request.params.id]);
    if (!workspaceInvitation) return createErrorResponse(ERRORS.WORKSPACE_INVITATION_NOT_FOUND);
    if (workspaceInvitation.deleted_at === null) return createErrorResponse(ERRORS.WORKSPACE_INVITATION_NOT_DELETED);

    return pool.query("UPDATE workspace_invitations SET deleted_at = NULL WHERE id = ?", [request.params.id]);
};


export const joinWorkspaceViaInvitation = async ({ token, user_id, username, socket, io }) => {
    try {
        const result = await joinWorkspaceWithInvitation({ token, user_id });

        if (result.error) return result;

        const workspaceId = result.result.workspace_id;

        socket.join(`workspace_${workspaceId}`);
        socket.workspaceId = workspaceId;
        
        socket.to(`workspace_${workspaceId}`).emit("workspaceUserJoined", {
            workspace_id: workspaceId,
            username,
        });
        

        return {
            result: { workspace_id: workspaceId },
            error: 0
        };

    } catch (error) {
        console.error("joinWorkspaceViaInvitation error:", error);
        return createErrorResponse({ code: 500, message: error.message });
    }
};
