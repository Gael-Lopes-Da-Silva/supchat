import express from "express";
const router = express.Router();

import {
    readRole,
} from "../controllers/Roles.js";

// GET /roles
//
// query:
//   name: string (optional)
// return:
//   result: [role]
router.get("/", (request, response) => {
    readRole(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "Roles > ReadRole",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Roles > ReadRole",
                error: result.error || 1,
                error_message: result.error_message || "Could not read role",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Roles > ReadRole",
            error: 1,
            error_message: error.message,
        });
    });
});

// GET /roles/:id
//
// param:
//   id: number (required)
// return:
//   result: [role]
router.get("/:id", (request, response) => {
    readRole(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "Roles > ReadRole",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Roles > ReadRole",
                error: result.error || 1,
                error_message: result.error_message || "Could not read role",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Roles > ReadRole",
            error: 1,
            error_message: error.message,
        });
    });
});

export default router;