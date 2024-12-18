import express from "express";

import {
    createWorkspace,
    createWorkspaceMember,
    readWorkspace,
    readWorkspaceMember,
    updateWorkspace,
    updateWorkspaceMember,
    deleteWorkspace,
    deleteWorkspaceMember
} from "../controllers/Workspaces.js";

const router = express.Router();

// --------------------
// Create
// --------------------

// POST /create
//
// body:
//   name: string (required)
//   description: string (required)
//   is_private: boolean (required)
//   user_id: integer (required)
// return:
//   result: [workspace]
router.post("/create", (request, response) => {
    createWorkspace(request).then((result) => {
        if (result !== "") {
            response.status(201).json({
                when: "Workspaces > CreateWorkspace",
                result: result,
                error: 0,
            });
        } else {
            response.status(500).json({
                when: "Workspaces > CreateWorkspace",
                error: 1,
                error_message: "User not found",
            });
        }
    }).catch((error) => {
        response.status(404).json({
            when: "Workspaces > CreateWorkspace",
            error: 1,
            error_message: error.message,
        });
    });
});

// POST /members/create
//
// body:
//   workspace_id: integer (required)
//   user_id: integer (required)
//   role: string (required)
// return:
//   result: [workspace_member]
router.post("/members/create", (request, response) => {
    createWorkspaceMember(request).then((result) => {
        if (result !== "") {
            response.status(201).json({
                when: "Workspaces > CreateWorkspaceMember",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Workspaces > CreateWorkspaceMember",
                error: 1,
                error_message: "User or workspace not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Workspaces > CreateWorkspaceMember",
            error: 1,
            error_message: error.message,
        });
    });
});

// --------------------
// Read
// --------------------

// GET /read
//
// body:
//   id: integer (optional)
//   name: string (optional)
//   description: string (optional)
//   is_private: boolean (optional)
//   user_id: integer (optional)
// return:
//   result: [workspace]
router.get("/read", (request, response) => {
    readWorkspace().then((result) => {
        if (result !== "") {
            response.status(200).json({
                when: "Workspaces > ReadWorkspace",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Workspaces > ReadWorkspace",
                error: 1,
                error_message: "Workspace not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Workspaces > ReadWorkspace",
            error: 1,
            error_message: error.message,
        });
    });
});

// GET /members/read
//
// body:
//   id: integer (optional)
//   workspace_id: integer (optional)
//   user_id: integer (optional)
//   role: string (optional)
// return:
//   result: [workspace_member]
router.get("/members/read", (request, response) => {
    readWorkspaceMember().then((result) => {
        if (result !== "") {
            response.status(200).json({
                when: "Workspaces > ReadWorkspaceMember",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Workspaces > ReadWorkspaceMember",
                error: 1,
                error_message: "User or workspace not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Workspaces > ReadWorkspaceMember",
            error: 1,
            error_message: error.message,
        });
    });
});

// --------------------
// Update
// --------------------

// PUT /update
//
// body:
//   id: integer (required)
//   name: string (optional)
//   description: string (optional)
//   is_private: boolean (optional)
//   user_id: integer (optional)
// return:
//   result: [workspace]
router.put("/update", (request, response) => {
    updateWorkspace(request).then((result) => {
        if (result !== "") {
            response.status(200).json({
                when: "Workspaces > UpdateWorkspace",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Workspaces > UpdateWorkspace",
                error: 1,
                error_message: "Workspace not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Workspaces > UpdateWorkspace",
            error: 1,
            error_message: error.message,
        });
    });
});

// PUT /members/update
//
// body:
//   id: integer (required)
//   user_id: integer (optional)
//   workspace_id: integer (optional)
//   role: string (optional)
// return:
//   result: [workspace_member]
router.put("/members/update", (request, response) => {
    updateWorkspaceMember(request).then((result) => {
        if (result !== "") {
            response.status(200).json({
                when: "Workspaces > UpdateWorkspaceMember",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Workspaces > UpdateWorkspaceMember",
                error: 1,
                error_message: "Workspace member not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Workspaces > UpdateWorkspaceMember",
            error: 1,
            error_message: error.message,
        });
    });
});

// --------------------
// Delete
// --------------------

// DELETE /delete
//
// body:
//   id: integer (required)
// return:
//   result: [workspace]
router.delete("/delete", (request, response) => {
    deleteWorkspace(request).then((result) => {
        if (result !== "") {
            response.status(200).json({
                when: "Workspaces > DeleteWorkspace",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Workspaces > DeleteWorkspace",
                error: 1,
                error_message: "Workspace not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Workspaces > DeleteWorkspace",
            error: 1,
            error_message: error.message,
        });
    });
});

// DELETE /members/delete
//
// body:
//   id: integer (required)
// return:
//   result: [workspace_member]
router.delete("/members/delete", (request, response) => {
    deleteWorkspaceMember(request).then((result) => {
        if (result !== "") {
            response.status(200).json({
                when: "Workspaces > DeleteWorkspaceMember",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Workspaces > DeleteWorkspaceMember",
                error: 1,
                error_message: "Workspace member not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Workspaces > DeleteWorkspaceMember",
            error: 1,
            error_message: error.message,
        });
    });
});

export default router;
