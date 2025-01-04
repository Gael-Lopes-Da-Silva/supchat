import express from "express";
const router = express.Router();

import {
    createWorkspacePermission,
    readWorkspacePermission,
    deleteWorkspacePermission,
} from "../controllers/WorkspacePermissions.js";

// POST /workspaces/permissions
//
// body:
//   user_id: number (required)
//   workspace_id: number (required)
//   permission_id: number (required)
// return:
//   result: [workspace_permission]
router.post("/", (request, response) => {
    createWorkspacePermission(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(201).json({
                when: "WorkspacePermissions > CreateWorkspacePermission",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "WorkspacePermissions > CreateWorkspacePermission",
                error: result.error || 1,
                error_message: result.error_message || "Could not create workspace permission",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "WorkspacePermissions > CreateWorkspacePermission",
            error: 1,
            error_message: error.message,
        });
    });
});

// GET /workspaces/permissions
//
// query:
//   user_id: number (optional)
//   workspace_id: number (optional)
//   permission_id: number (optional)
// return:
//   result: [workspace_permission]
router.get("/", (request, response) => {
    readWorkspacePermission(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "WorkspacePermissions > ReadWorkspacePermission",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "WorkspacePermissions > ReadWorkspacePermission",
                error: result.error || 1,
                error_message: result.error_message || "Could not read workspace permission",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "WorkspacePermissions > ReadWorkspacePermission",
            error: 1,
            error_message: error.message,
        });
    });
});

// GET /workspaces/permissions/user/:user_id/workspace/:workspace_id/permission/:permission_id
//
// param:
//   user_id: number (optional)
//   workspace_id: number (optional)
//   permission_id: number (optional)
// return:
//   result: [workspace_permission]
router.get("/user/:user_id/workspace/:workspace_id/permission/:permission_id", (request, response) => {
    readWorkspacePermission(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "WorkspacePermissions > ReadWorkspacePermission",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "WorkspacePermissions > ReadWorkspacePermission",
                error: result.error || 1,
                error_message: result.error_message || "Could not read workspace permission",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "WorkspacePermissions > ReadWorkspacePermission",
            error: 1,
            error_message: error.message,
        });
    });
});

// DELETE /workspaces/permissions/user/:user_id/workspace/:workspace_id/permission/:permission_id
//
// param:
//   user_id: number (required)
//   workspace_id: number (required)
//   permission_id: number (required)
// return:
//   result: [workspace_permission]
router.delete("/user/:user_id/workspace/:workspace_id/permission/:permission_id", (request, response) => {
    deleteWorkspacePermission(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "WorkspacePermissions > DeleteWorkspacePermission",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "WorkspacePermissions > DeleteWorkspacePermission",
                error: result.error || 1,
                error_message: result.error_message || "Could not delete workspace permission",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "WorkspacePermissions > DeleteWorkspacePermission",
            error: 1,
            error_message: error.message,
        });
    });
});

export default router;