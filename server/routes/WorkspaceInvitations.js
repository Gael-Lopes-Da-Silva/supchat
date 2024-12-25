import express from "express";

import {
    createWorkspaceInvitation,
    readWorkspaceInvitation,
    updateWorkspaceInvitation,
    deleteWorkspaceInvitation,
    restoreWorkspaceInvitation,
} from "../controllers/WorkspaceInvitations.js";

const router = express.Router();

// --------------------
// Create
// --------------------

// POST /workspaces/invitation/create
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
router.post("/create", (request, response) => {
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
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not create workspace invitation",
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

// --------------------
// Read
// --------------------

// GET /workspaces/invitations/read
//
// body:
//   id: number (optional)
//   user_id: number (optional)
//   workspace_id: number (optional)
//   token: string (optional)
//   maximum_use: number (optional)
//   used_by: number (optional)
//   expire_at: date (optional)
// return:
//   result: [workspace_invitation]
router.get("/read", (request, response) => {
    readWorkspaceInvitation().then((result) => {
        if (!result.error && result !== "") {
            response.status(200).json({
                when: "WorkspaceInvitations > ReadWorkspaceInvitation",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "WorkspaceInvitations > ReadWorkspaceInvitation",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not read workspace invitation",
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

// --------------------
// Update
// --------------------

// PUT /workspaces/invitations/update
//
// body:
//   id: number (required)
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
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not update workspace invitation",
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

// --------------------
// Delete
// --------------------

// DELETE /workspaces/invitations/delete
//
// body:
//   id: number (required)
// return:
//   result: [workspace_invitation]
router.delete("/delete", (request, response) => {
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
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not delete workspace invitation",
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

// DELETE /workspaces/invitations/restore
//
// body:
//   id: number (required)
// return:
//   result: [workspace_invitation]
router.delete("/restore", (request, response) => {
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
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not restore workspace invitation",
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
