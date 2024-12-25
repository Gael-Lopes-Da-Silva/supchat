import express from "express";

import {
    createWorkspaceMember,
    readWorkspaceMember,
    updateWorkspaceMember,
    deleteWorkspaceMember,
    restoreWorkspaceMember,
} from "../controllers/WorkspaceMembers.js";

const router = express.Router();

// --------------------
// Create
// --------------------

// POST /workspaces/members/create
//
// body:
//   workspace_id: number (required)
//   user_id: number (required)
//   role_id: number (required)
// return:
//   result: [workspace_member]
router.post("/create", (request, response) => {
    createWorkspaceMember(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(201).json({
                when: "WorkspaceMembers > CreateWorkspaceMember",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "WorkspaceMembers > CreateWorkspaceMember",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not create workspace member",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "WorkspaceMembers > CreateWorkspaceMember",
            error: 1,
            error_message: error.message,
        });
    });
});

// --------------------
// Read
// --------------------

// GET /workspaces/members/read
//
// body:
//   id: number (optional)
//   workspace_id: number (optional)
//   user_id: number (optional)
//   role_id: number (optional)
// return:
//   result: [workspace_member]
router.get("/read", (request, response) => {
    readWorkspaceMember().then((result) => {
        if (!result.error && result !== "") {
            response.status(200).json({
                when: "WorkspaceMembers > ReadWorkspaceMember",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "WorkspaceMembers > ReadWorkspaceMember",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not read workspace member",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "WorkspaceMembers > ReadWorkspaceMember",
            error: 1,
            error_message: error.message,
        });
    });
});

// --------------------
// Update
// --------------------

// PUT /workspaces/members/update
//
// body:
//   id: number (required)
//   user_id: number (optional)
//   workspace_id: number (optional)
//   role_id: number (optional)
// return:
//   result: [workspace_member]
router.put("/update", (request, response) => {
    updateWorkspaceMember(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(200).json({
                when: "WorkspaceMembers > UpdateWorkspaceMember",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "WorkspaceMembers > UpdateWorkspaceMember",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not update workspace member",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "WorkspaceMembers > UpdateWorkspaceMember",
            error: 1,
            error_message: error.message,
        });
    });
});

// --------------------
// Delete
// --------------------

// DELETE /workspaces/members/delete
//
// body:
//   id: number (required)
// return:
//   result: [workspace_member]
router.delete("/delete", (request, response) => {
    deleteWorkspaceMember(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(200).json({
                when: "WorkspaceMembers > DeleteWorkspaceMember",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "WorkspaceMembers > DeleteWorkspaceMember",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not delete workspace member",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "WorkspaceMembers > DeleteWorkspaceMember",
            error: 1,
            error_message: error.message,
        });
    });
});

// DELETE /workspaces/members/restore
//
// body:
//   id: number (required)
// return:
//   result: [workspace_member]
router.delete("/restore", (request, response) => {
    restoreWorkspaceMember(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(200).json({
                when: "WorkspaceMembers > RestoreWorkspaceMember",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "WorkspaceMembers > RestoreWorkspaceMember",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not restore workspace member",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "WorkspaceMembers > RestoreWorkspaceMember",
            error: 1,
            error_message: error.message,
        });
    });
});

export default router;
