import express from "express";

import {
    readPermission,
} from "../controllers/Permissions.js";

const router = express.Router();

// GET /permissions
//
// query:
//   name: string (optional)
// return:
//   result: [permission]
router.get("/", (request, response) => {
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
                error: result.error || 1,
                error_message: result.error_message || "Could not read permission",
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

// GET /permissions/:id
//
// param:
//   id: number (required)
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
                error: result.error || 1,
                error_message: result.error_message || "Could not read permission",
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

export default router;