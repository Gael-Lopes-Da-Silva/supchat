import express from "express";

import {
    createWorkspace,
    readWorkspace,
    updateWorkspace,
    deleteWorkspace,
    restoreWorkspace,
} from "../controllers/Workspaces.js";

const router = express.Router();

// --------------------
// Create
// --------------------

// POST /workspaces/create
//
// body:
//   name: string (required)
//   description: string (required)
//   is_private: boolean (required)
//   user_id: number (required)
// return:
//   result: [workspace]
router.post("/create", (request, response) => {
    createWorkspace(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(201).json({
                when: "Workspaces > CreateWorkspace",
                result: result,
                error: 0,
            });
        } else {
            response.status(500).json({
                when: "Workspaces > CreateWorkspace",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not create workspace",
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

// --------------------
// Read
// --------------------

// GET /workspaces/read
//
// body:
//   id: number (optional)
//   name: string (optional)
//   description: string (optional)
//   is_private: boolean (optional)
//   user_id: number (optional)
// return:
//   result: [workspace]
router.get("/read", (request, response) => {
    readWorkspace().then((result) => {
        if (!result.error && result !== "") {
            response.status(200).json({
                when: "Workspaces > ReadWorkspace",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Workspaces > ReadWorkspace",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not read workspace",
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

// --------------------
// Update
// --------------------

// PUT /workspaces/update
//
// body:
//   id: number (required)
//   name: string (optional)
//   description: string (optional)
//   is_private: boolean (optional)
//   user_id: number (optional)
// return:
//   result: [workspace]
router.put("/update", (request, response) => {
    updateWorkspace(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(200).json({
                when: "Workspaces > UpdateWorkspace",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Workspaces > UpdateWorkspace",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not update workspace",
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

// --------------------
// Delete
// --------------------

// DELETE /workspaces/delete
//
// body:
//   id: number (required)
// return:
//   result: [workspace]
router.delete("/delete", (request, response) => {
    deleteWorkspace(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(200).json({
                when: "Workspaces > DeleteWorkspace",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Workspaces > DeleteWorkspace",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not delete workspace",
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

// DELETE /workspaces/restore
//
// body:
//   id: number (required)
// return:
//   result: [workspace]
router.delete("/restore", (request, response) => {
    restoreWorkspace(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(200).json({
                when: "Workspaces > RestoreWorkspace",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Workspaces > RestoreWorkspace",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not restore workspace",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Workspaces > RestoreWorkspace",
            error: 1,
            error_message: error.message,
        });
    });
});

export default router;
