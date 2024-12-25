import express from "express";

const router = express.Router();

import {
    readStatus,
} from "../controllers/Status.js";

// --------------------
// Create
// --------------------

// Add it in base.sql

// --------------------
// Read
// --------------------

// GET /status/read
//
// body:
//   id: number (optional)
//   name: string (optional)
// return:
//   result: [status]
router.get("/read", (request, response) => {
    readStatus(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "Status > ReadStatus",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Status > ReadStatus",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not read status",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Status > ReadStatus",
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