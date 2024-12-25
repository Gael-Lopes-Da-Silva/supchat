import express from "express";

import {
    createChannel,
    readChannel,
    updateChannel,
    deleteChannel,
    restoreChannel,
} from "../controllers/Channels.js";

const router = express.Router();

// --------------------
// Create
// --------------------

// POST /channels/create
//
// body:
//   user_id: number (required)
//   workspace_id: number (required)
//   name: string (required)
//   is_private: boolean (required)
// return:
//   result: [channel]
router.post("/create", (request, response) => {
    createChannel(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(201).json({
                when: "Channels > CreateChannel",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Channels > CreateChannel",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not create channel",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Channels > CreateChannel",
            error: 1,
            error_message: error.message,
        });
    });
});

// --------------------
// Read
// --------------------

// GET /channels/read
//
// body:
//   id: number (optional)
//   workspace_id: number (optional)
//   name: string (optional)
//   is_private: boolean (optional)
//   user_id: number (optional)
// return:
//   result: [channel]
router.get("/read", (request, response) => {
    readChannel(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "Channels > ReadChannel",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Channels > ReadChannel",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not read channel",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Channels > ReadChannel",
            error: 1,
            error_message: error.message,
        });
    });
});

// --------------------
// Update
// --------------------

// PUT /channels/update
//
// body:
//   id: number (required)
//   workspace_id: number (optional)
//   name: string (optional)
//   is_private: boolean (optional)
//   user_id: number (optional)
// return:
//   result: [channel]
router.put("/update", (request, response) => {
    updateChannel(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "Channels > UpdateChannel",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Channels > UpdateChannel",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not update channel",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Channels > UpdateChannel",
            error: 1,
            error_message: error.message,
        });
    });
});

// --------------------
// Delete
// --------------------

// DELETE /channels/delete
//
// body:
//   id: number (required)
// return:
//   result: [channel]
router.delete("/delete", (request, response) => {
    deleteChannel(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "Channels > DeleteChannel",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Channels > DeleteChannel",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not delete channel",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Channels > DeleteChannel",
            error: 1,
            error_message: error.message,
        });
    });
});

// DELETE /channels/restore
//
// body:
//   id: number (required)
// return:
//   result: [channel]
router.delete("/restore", (request, response) => {
    restoreChannel(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "Channels > RestoreChannel",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Channels > RestoreChannel",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not restore channel",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Channels > RestoreChannel",
            error: 1,
            error_message: error.message,
        });
    });
});

export default router;