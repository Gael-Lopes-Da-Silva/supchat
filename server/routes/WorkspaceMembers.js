import express from "express";
const router = express.Router();

import {
    createWorkspaceMember,
    readWorkspaceMember,
    updateWorkspaceMember,
    deleteWorkspaceMember,
    restoreWorkspaceMember,
} from "../controllers/WorkspaceMembers.js";

// POST /workspaces/members
//
// body:
//   workspace_id: number (required)
//   user_id: number (required)
//   role_id: number (required)
// return:
//   result: [workspace_member]
router.post("/", (request, response) => {
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

// GET /workspaces/members
//
// query:
//   workspace_id: number (optional)
//   user_id: number (optional)
//   role_id: number (optional)
// return:
//   result: [workspace_member]
router.get("/", (request, response) => {
    readWorkspaceMember(request).then((result) => {
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

// GET /workspaces/members/:id
//
// param:
//   id: number (required)
// return:
//   result: [workspace_member]
router.get("/:id", (request, response) => {
    readWorkspaceMember(request).then((result) => {
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

// PUT /workspaces/members/:id
//
// param:
//   id: number (required)
// body:
//   user_id: number (optional)
//   workspace_id: number (optional)
//   role_id: number (optional)
// return:
//   result: [workspace_member]
router.put("/:id", (request, response) => {
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

// DELETE /workspaces/members/:id
//
// param:
//   id: number (required)
// return:
//   result: [workspace_member]
router.delete("/:id", (request, response) => {
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

// PATCH /workspaces/members/:id
//
// param:
//   id: number (required)
// return:
//   result: [workspace_member]
router.patch("/:id", (request, response) => {
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
