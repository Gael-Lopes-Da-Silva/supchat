import express from "express";

import {
    createRolePermission,
    readRolePermission,
    deleteRolePermission,
} from "../controllers/RolePermissions.js";

const router = express.Router();

// --------------------
// Create
// --------------------

// POST /roles/permissions/create
//
// body:
//   role_id: number (required)
//   permission_id: number (required)
// return:
//   result: [role_permission]
router.post("/create", (request, response) => {
    createRolePermission(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(201).json({
                when: "RolePermissions > CreateRolePermission",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "RolePermissions > CreateRolePermission",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not create role permission",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "RolePermissions > CreateRolePermission",
            error: 1,
            error_message: error.message,
        });
    });
});

// --------------------
// Read
// --------------------

// GET /roles/permissions/read
//
// body:
//   role_id: number (optional)
//   permission_id: number (optional)
// return:
//   result: [role_permission]
router.get("/read", (request, response) => {
    readRolePermission(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "RolePermissions > ReadRolePermission",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "RolePermissions > ReadRolePermission",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not read role permission",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "RolePermissions > ReadRolePermission",
            error: 1,
            error_message: error.message,
        });
    });
});

// --------------------
// Update
// --------------------

// Use Add and Delete to update

// --------------------
// Delete
// --------------------

// DELETE /roles/permissions/delete
//
// body:
//   role_id: number (required)
//   permission_id: number (required)
// return:
//   result: [role_permission]
router.delete("/delete", (request, response) => {
    deleteRolePermission(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "RolePermissions > DeleteRolePermission",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "RolePermissions > DeleteRolePermission",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not delete role permission",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "RolePermissions > DeleteRolePermission",
            error: 1,
            error_message: error.message,
        });
    });
});

export default router;