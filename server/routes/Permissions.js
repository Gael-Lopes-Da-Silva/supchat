import express from "express";

const router = express.Router();

import {
    readPermission,
} from "../controllers/Permissions.js";

// --------------------
// Create
// --------------------

// Add it in base.sql

// --------------------
// Read
// --------------------

// GET /permissions/read
//
// body:
//   id: number (optional)
//   name: string (optional)
// return:
//   result: [permission]
router.get("/read", (request, response) => {
    readPermission(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "Permissions > ReadPermission",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Permissions > ReadPermission",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not read permission",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Permissions > ReadPermission",
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