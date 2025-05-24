import express from "express";

import {
    createWorkspaceMember,
    readWorkspaceMember,
    updateWorkspaceMember,
    deleteWorkspaceMember,
    restoreWorkspaceMember,
} from "../controllers/WorkspaceMembers.js";
import { ensureAuthenticated } from "../middlewares/JwtAuth.js";

import { validateCreateWorkspaceMember } from "../validators/workspaceMembers.js";
import { handleValidationErrors } from "../middlewares/Validate.js";

const router = express.Router();
router.use(ensureAuthenticated);


// POST /workspaces/members
//
// body:
//   workspace_id: number (required)
//   user_id: number (required)
//   role_id: number (required)
// return:
//   result: [workspace_member]

router.post("/", validateCreateWorkspaceMember, handleValidationErrors, (request, response) => {
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
        error: result.error || 1,
        error_message: result.error_message || "Could not create workspace member",
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
                error: result.error || 1,
                error_message: result.error_message || "Could not read workspace member",
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
                error: result.error || 1,
                error_message: result.error_message || "Could not read workspace member",
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

router.put("/:id", (req, res) => {
    const io = req.app.get("io");

    updateWorkspaceMember(req, io).then((result) => {
        if (!result.error && result !== "") {
            res.status(200).json({
                when: "WorkspaceMembers > UpdateWorkspaceMember",
                result: result,
                error: 0,
            });
        } else {
            res.status(404).json({
                when: "WorkspaceMembers > UpdateWorkspaceMember",
                error: result.error || 1,
                error_message: result.error_message || "Could not update workspace member",
            });
        }
    }).catch((error) => {
        res.status(500).json({
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
router.delete("/:id", (req, res) => {
    const io = req.app.get("io");

    deleteWorkspaceMember(req, io)
        .then((result) => {
            if (!result.error && result !== "") {
                res.status(200).json({
                    when: "WorkspaceMembers > DeleteWorkspaceMember",
                    result: result,
                    error: 0,
                });
            } else {
                res.status(404).json({
                    when: "WorkspaceMembers > DeleteWorkspaceMember",
                    error: result.error || 1,
                    error_message: result.error_message || "Could not delete workspace member",
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
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
                error: result.error || 1,
                error_message: result.error_message || "Could not restore workspace member",
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

