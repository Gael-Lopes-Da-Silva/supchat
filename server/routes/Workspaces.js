import express from "express";
import { validateCreateWorkspace } from "../validators/workspaces.js";
import { handleValidationErrors } from "../middlewares/Validate.js";
import { ensureAuthenticated } from "../middlewares/JwtAuth.js";

import {
    createWorkspace,
    readWorkspace,
    updateWorkspace,
    deleteWorkspace,
    restoreWorkspace,
    readPublicWorkspaces
} from "../controllers/Workspaces.js";

const router = express.Router();
router.use(ensureAuthenticated);


// POST /workspaces
//
// body:
//   name: string (required)
//   description: string (optional)
//   is_private: boolean (optional)
//   user_id: number (required)
// return:
//   result: [workspace]

router.post(
  "/",
  validateCreateWorkspace,
  handleValidationErrors,
  (request, response) => {
    createWorkspace(request).then((result) => {
      if (!result.error && result !== "") {
        response.status(201).json({
          when: "Workspaces > CreateWorkspace",
          result: result,
          error: 0,
        });
      } else {
        response.status(400).json({
          when: "Workspaces > CreateWorkspace",
          error: result.error || 1,
          error_message: result.error_message || "Could not create workspace",
        });
      }
    }).catch((error) => {
      response.status(500).json({
        when: "Workspaces > CreateWorkspace",
        error: 1,
        error_message: error.message,
      });
    });
  }
);


// GET /workspaces
//
// query:
//   name: string (optional)
//   description: string (optional)
//   is_private: boolean (optional)
//   user_id: number (optional)
// return:
//   result: [workspace]
router.get("/", (request, response) => {
    readWorkspace(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(200).json({
                when: "Workspaces > ReadWorkspace",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Workspaces > ReadWorkspace",
                error: result.error || 1,
                error_message: result.error_message || "Could not read workspace",
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


router.get("/public", (request, response) => {
    readPublicWorkspaces(request).then((result) => {
        response.status(200).json(result); 
    }).catch((error) => {
        response.status(500).json({
            error: 1,
            error_message: error.message,
        });
    });
});


// GET /workspaces/:id
//
// param:
//   id: number (required)
// return:
//   result: [workspace]
router.get("/:id", (request, response) => {
    readWorkspace(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(200).json({
                when: "Workspaces > ReadWorkspace",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Workspaces > ReadWorkspace",
                error: result.error || 1,
                error_message: result.error_message || "Could not read workspace",
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

// PUT /workspaces/:id
//
// param:
//   id: number (required)
// body:
//   name: string (optional)
//   description: string (optional)
//   is_private: boolean (optional)
//   user_id: number (optional)
// return:
//   result: [workspace]
router.put("/:id", (request, response) => {
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
                error: result.error || 1,
                error_message: result.error_message || "Could not update workspace",
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

// DELETE /workspaces/:id
//
// param:
//   id: number (required)
// return:
//   result: [workspace]
router.delete("/:id", (request, response) => {
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
                error: result.error || 1,
                error_message: result.error_message || "Could not delete workspace",
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

// PATCH /workspaces/:id
//
// param:
//   id: number (required)
// return:
//   result: [workspace]
router.patch("/:id", (request, response) => {
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
                error: result.error || 1,
                error_message: result.error_message || "Could not restore workspace",
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
