import express from "express";

import {
    createChannel,
    readChannel,
    updateChannel,
    deleteChannel,
    restoreChannel,
} from "../controllers/Channels.js";

const router = express.Router();

// POST /channels
//
// body:
//   user_id: number (required)
//   workspace_id: number (required)
//   name: string (required)
//   is_private: boolean (optional)
// return:
//   result: [channel]
router.post("/", (request, response) => {
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
                error: result.error || 1,
                error_message: result.error_message || "Could not create channel",
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

// GET /channels
//
// query:
//   workspace_id: number (optional)
//   name: string (optional)
//   is_private: boolean (optional)
//   user_id: number (optional)
// return:
//   result: [channel]
router.get("/", (request, response) => {
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
                error: result.error || 1,
                error_message: result.error_message || "Could not read channel",
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



// GET /channels/:id
//
// params:
//   id: number (required)
// return:
//   result: [channel]
router.get("/:id", (request, response) => {
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
                error: result.error || 1,
                error_message: result.error_message || "Could not read channel",
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

// PUT /channels/:id
//
// param:
//   id: number (required)
// body:
//   workspace_id: number (optional)
//   name: string (optional)
//   is_private: boolean (optional)
//   user_id: number (optional)
// return:
//   result: [channel]
router.put("/:id", (request, response) => {
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
                error: result.error || 1,
                error_message: result.error_message || "Could not update channel",
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

// DELETE /channels/:id
//
// param:
//   id: number (required)
// return:
//   result: [channel]
router.delete("/:id", (request, response) => {
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
                error: result.error || 1,
                error_message: result.error_message || "Could not delete channel",
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

// PATCH /channels/:id
//
// param:
//   id: number (required)
// return:
//   result: [channel]
router.patch("/:id", (request, response) => {
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
                error: result.error || 1,
                error_message: result.error_message || "Could not restore channel",
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