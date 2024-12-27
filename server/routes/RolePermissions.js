import express from "express";

import {
    createRolePermission,
    readRolePermission,
    deleteRolePermission,
} from "../controllers/RolePermissions.js";

const router = express.Router();

// POST /roles/permissions
//
// body:
//   role_id: number (required)
//   permission_id: number (required)
// return:
//   result: [role_permission]
router.post("/", (request, response) => {
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

// GET /roles/permissions
//
// query:
//   role_id: number (optional)
//   permission_id: number (optional)
// return:
//   result: [role_permission]
router.get("/", (request, response) => {
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

// GET /roles/permissions/role/:role_id/permission/:permission_id
//
// param:
//   role_id: number (required)
//   permission_id: number (required)
// return:
//   result: [role_permission]
router.get("/role/:role_id/permission/:permission_id", (request, response) => {
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

// DELETE /roles/permissions/role/:role_id/permission/:permission_id
//
// param:
//   role_id: number (required)
//   permission_id: number (required)
// return:
//   result: [role_permission]
router.delete("/role/:role_id/permission/:permission_id", (request, response) => {
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