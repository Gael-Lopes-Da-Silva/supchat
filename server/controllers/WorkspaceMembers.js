import pool from "../database/db.js";
import { ERRORS, createErrorResponse } from "../app/ErrorHandler.js";

export const createWorkspaceMember = async (request) => {
  const { user_id, workspace_id, role_id } = request.body;

  if (!user_id) return createErrorResponse({ code: 400, message: "USER_ID_NOT_PROVIDED" });
  if (!workspace_id) return createErrorResponse({ code: 400, message: "WORKSPACE_ID_NOT_PROVIDED" });
  if (!role_id) return createErrorResponse({ code: 400, message: "ROLE_ID_NOT_PROVIDED" });

  const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [user_id]);
  if (!user) return createErrorResponse({ code: 404, message: "USER_NOT_FOUND" });
  if (user.deleted_at !== null) return createErrorResponse({ code: 400, message: "USER_DELETED" });

  const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [workspace_id]);
  if (!workspace) return createErrorResponse({ code: 404, message: "WORKSPACE_NOT_FOUND" });
  if (workspace.deleted_at !== null) return createErrorResponse({ code: 400, message: "WORKSPACE_DELETED" });

  const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [role_id]);
  if (!role) return createErrorResponse({ code: 404, message: "ROLE_NOT_FOUND" });

  const [existingMember] = await pool.query(
    "SELECT * FROM workspace_members WHERE user_id = ? AND workspace_id = ?",
    [user_id, workspace_id]
  );

  if (existingMember) {
    if (existingMember.deleted_at !== null) {
      // ✅ Restaurer l'entrée soft-deleted
      await pool.query(
        "UPDATE workspace_members SET deleted_at = NULL, role_id = ? WHERE user_id = ? AND workspace_id = ?",
        [role_id, user_id, workspace_id]
      );
      return { success: true, restored: true };
    } else {
      return createErrorResponse({ code: 409, message: "USER_ALREADY_EXISTS_IN_WORKSPACE" });
    }
  }

  // ✅ Créer une nouvelle entrée
  await pool.query(
    "INSERT INTO workspace_members (workspace_id, user_id, role_id) VALUES (?, ?, ?)",
    [workspace_id, user_id, role_id]
  );

  return { success: true, created: true };
};


export const readWorkspaceMember = async (request) => {
  if (request.params.id) {
    const [workspaceMember] = await pool.query("SELECT * FROM workspace_members WHERE id = ?", [request.params.id]);
    if (!workspaceMember) return createErrorResponse(ERRORS.WORKSPACE_MEMBER_NOT_FOUND);
    return workspaceMember;
  } else {
    let query = `
            SELECT wm.*, u.username 
            FROM workspace_members wm 
            JOIN users u ON wm.user_id = u.id
        `;
    let where = [];
    let params = [];

    if (request.query.workspace_id) {
      const [workspace] = await pool.query("SELECT * FROM workspaces WHERE id = ?", [request.query.workspace_id]);
      if (!workspace) return createErrorResponse(ERRORS.WORKSPACE_NOT_FOUND);
      where.push("wm.workspace_id = ?");
      params.push(request.query.workspace_id);
    }

    if (request.query.user_id) {
      const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [request.query.user_id]);
      if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
      where.push("wm.user_id = ?");
      params.push(request.query.user_id);
    }

    if (request.query.role_id) {
      const [role] = await pool.query("SELECT * FROM roles WHERE id = ?", [request.query.role_id]);
      if (!role) return createErrorResponse(ERRORS.ROLE_NOT_FOUND);
      where.push("wm.role_id = ?");
      params.push(request.query.role_id);
    }

    if (where.length > 0) {
      query += " WHERE " + where.join(" AND ");
    }

    return pool.query(query, params);
  }
};

export const updateWorkspaceMember = async (request, io = null) => {
  const { workspace_id, user_id, role_id } = request.body;
  const currentUserId = request.user?.id;

  if (!workspace_id || !user_id || !role_id) {
    return createErrorResponse("MISSING_FIELDS");
  }

  const currentUserRows = await pool.query(
    "SELECT role_id FROM workspace_members WHERE user_id = ? AND workspace_id = ?",
    [currentUserId, workspace_id]
  );

  const currentUserRoleId = currentUserRows[0]?.role_id;

  if (currentUserRoleId !== 1) {
    return {
      error: 1,
      error_message: "Seuls les admins peuvent modifier les rôles.",
    };
  }

  await pool.query(
    "UPDATE workspace_members SET workspace_id = ?, user_id = ?, role_id = ? WHERE id = ?",
    [workspace_id, user_id, role_id, request.params.id]
  );


  if (io && user_id) {
    io.to(`user_${user_id}`).emit("roleUpdated", {
      workspace_id,
      new_role_id: role_id,
      user_id
    });
  }



  return {
    error: 0,
    result: {
      id: request.params.id,
      updatedFields: { workspace_id, user_id, role_id },
    },
  };
};

export const deleteWorkspaceMember = async (request, io) => {
  const { id } = request.params;
  const currentUserId = request.user?.id;

  if (!id) return createErrorResponse(ERRORS.WORKSPACE_MEMBER_ID_NOT_PROVIDED);

  const rows = await pool.query("SELECT * FROM workspace_members WHERE id = ?", [id]);
  const member = rows[0];

  if (!member) return createErrorResponse(ERRORS.WORKSPACE_MEMBER_NOT_FOUND);
  if (member.deleted_at !== null) return createErrorResponse(ERRORS.WORKSPACE_MEMBER_ALREADY_DELETED);

  // Verif que l'user actuel est bien admin dans ce ws
  const currentUserRoleRows = await pool.query(
    "SELECT role_id FROM workspace_members WHERE user_id = ? AND workspace_id = ? AND deleted_at IS NULL",
    [currentUserId, member.workspace_id]
  );
  const currentUserRole = currentUserRoleRows[0];

  if (!currentUserRole || currentUserRole.role_id !== 1) {
    return createErrorResponse({
      code: 403,
      message: "Seuls les administrateurs peuvent expulser un membre.",
    });
  }

  // soft 
  const result = await pool.query(
    "UPDATE workspace_members SET deleted_at = NOW() WHERE id = ?",
    [id]
  );

  if (io) {
    io.to(`user_${member.user_id}`).emit("kickedFromWorkspace", {
      workspace_id: member.workspace_id,
    });

    io.to(`workspace_${member.workspace_id}`).emit("refreshWorkspaceMembers", {
      workspace_id: member.workspace_id,
    });
  }

  return {
    result,
    error: 0,
  };
};



export const restoreWorkspaceMember = async (request) => {
  if (!request.params.id) return createErrorResponse(ERRORS.ID_NOT_PROVIDED);

  const [workspaceMember] = await pool.query("SELECT * FROM workspace_members WHERE id = ?", [request.params.id]);
  if (!workspaceMember) return createErrorResponse(ERRORS.WORKSPACE_MEMBER_NOT_FOUND);
  if (workspaceMember.deleted_at === null) return createErrorResponse(ERRORS.WORKSPACE_MEMBER_NOT_DELETED);

  return pool.query("UPDATE workspace_members SET deleted_at = NULL WHERE id = ?", [request.params.id]);
};



export const readWorkspaceMembersByWorkspaceId = async (request) => {
  const { workspace_id } = request.query;

  if (!workspace_id) {
    return {
      error: 1,
      error_message: "workspace_id requis",
    };
  }

  const rows = await pool.query(
    `SELECT wm.id, wm.user_id, wm.role_id, u.username
     FROM workspace_members wm
     JOIN users u ON wm.user_id = u.id
     WHERE wm.workspace_id = ? AND wm.deleted_at IS NULL`,
    [workspace_id]
  );

  return rows;
};
