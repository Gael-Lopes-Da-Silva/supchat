import express from "express";

const router = express.Router();

import {
    readRole,
} from "../controllers/Roles.js";

// --------------------
// Create
// --------------------

// Add it in base.sql

// --------------------
// Read
// --------------------

// GET /roles/read
//
// body:
//   id: number (optional)
//   name: string (optional)
// return:
//   result: [role]
router.get("/read", (request, response) => {
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
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not read role",
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

// --------------------
// Update
// --------------------

// Update it in base.sql

// --------------------
// Delete
// --------------------

// Delete it in base.sql

export default router;