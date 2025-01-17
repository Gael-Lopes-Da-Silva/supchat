import express from "express";

import {
    readStatus,
} from "../controllers/Status.js";

const router = express.Router();

// GET /status
//
// query:
//   name: string (optional)
// return:
//   result: [status]
router.get("/", (request, response) => {
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
                error: result.error || 1,
                error_message: result.error_message || "Could not read status",
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

// GET /status/:id
//
// param:
//   id: number (required)
// return:
//   result: [status]
router.get("/:id", (request, response) => {
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
                error: result.error || 1,
                error_message: result.error_message || "Could not read status",
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

export default router;