import express from "express";

import {
    createWorkspaceInvitation,
    readWorkspaceInvitation,
    updateWorkspaceInvitation,
    deleteWorkspaceInvitation,
    restoreWorkspaceInvitation,
} from "../controllers/WorkspaceInvitations.js";

const router = express.Router();

// POST /workspaces/invitations
//
// body:
//   workspace_id: number (required)
//   user_id: number (required)
//   token: string (required)
//   maximum_use: number (optional)
//   used_by: number (optional)
//   expire_at: date (optional)
// return:
//   result: [workspace_invitation]
router.post("/", (request, response) => {
    createWorkspaceInvitation(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(201).json({
                when: "WorkspaceInvitations > CreateWorkspaceInvitation",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "WorkspaceInvitations > CreateWorkspaceInvitation",
                error: result.error || 1,
                error_message: result.error_message || "Could not create workspace invitation",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "WorkspaceInvitations > CreateWorkspaceInvitation",
            error: 1,
            error_message: error.message,
        });
    });
});

// GET /workspaces/invitations
//
// query:
//   user_id: number (optional)
//   workspace_id: number (optional)
//   token: string (optional)
//   maximum_use: number (optional)
//   used_by: number (optional)
//   expire_at: date (optional)
// return:
//   result: [workspace_invitation]
router.get("/", (request, response) => {
    readWorkspaceInvitation(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(200).json({
                when: "WorkspaceInvitations > ReadWorkspaceInvitation",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "WorkspaceInvitations > ReadWorkspaceInvitation",
                error: result.error || 1,
                error_message: result.error_message || "Could not read workspace invitation",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "WorkspaceInvitations > ReadWorkspaceInvitation",
            error: 1,
            error_message: error.message,
        });
    });
});

// GET /workspaces/invitations/:id
//
// param:
//   id: number (optional)
// return:
//   result: [workspace_invitation]
router.get("/:id", (request, response) => {
    readWorkspaceInvitation(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(200).json({
                when: "WorkspaceInvitations > ReadWorkspaceInvitation",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "WorkspaceInvitations > ReadWorkspaceInvitation",
                error: result.error || 1,
                error_message: result.error_message || "Could not read workspace invitation",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "WorkspaceInvitations > ReadWorkspaceInvitation",
            error: 1,
            error_message: error.message,
        });
    });
});

// PUT /workspaces/invitations/:id
//
// param:
//   id: number (required)
// body:
//   user_id: number (optional)
//   workspace_id: number (optional)
//   token: string (optional)
//   maximum_use: number (optional)
//   used_by: number (optional)
//   expire_at: date (optional)
// return:
//   result: [workspace_invitation]
router.put("/update", (request, response) => {
    updateWorkspaceInvitation(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(200).json({
                when: "WorkspaceInvitations > UpdateWorkspaceInvitation",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "WorkspaceInvitations > UpdateWorkspaceInvitation",
                error: result.error || 1,
                error_message: result.error_message || "Could not update workspace invitation",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "WorkspaceInvitations > UpdateWorkspaceInvitation",
            error: 1,
            error_message: error.message,
        });
    });
});

// DELETE /workspaces/invitations/:id
//
// param:
//   id: number (required)
// return:
//   result: [workspace_invitation]
router.delete("/:id", (request, response) => {
    deleteWorkspaceInvitation(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(200).json({
                when: "WorkspaceInvitations > DeleteWorkspaceInvitation",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "WorkspaceInvitations > DeleteWorkspaceInvitation",
                error: result.error || 1,
                error_message: result.error_message || "Could not delete workspace invitation",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "WorkspaceInvitations > DeleteWorkspaceInvitation",
            error: 1,
            error_message: error.message,
        });
    });
});

// PATCH /workspaces/invitations/:id
//
// param:
//   id: number (required)
// return:
//   result: [workspace_invitation]
router.patch("/:id", (request, response) => {
    restoreWorkspaceInvitation(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(200).json({
                when: "WorkspaceInvitations > RestoreWorkspaceInvitation",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "WorkspaceInvitations > RestoreWorkspaceInvitation",
                error: result.error || 1,
                error_message: result.error_message || "Could not restore workspace invitation",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "WorkspaceInvitations > RestoreWorkspaceInvitation",
            error: 1,
            error_message: error.message,
        });
    });
});

export default router;
