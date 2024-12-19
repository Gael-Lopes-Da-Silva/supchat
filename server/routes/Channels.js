import express from "express";

import {
    createChannel,
    readChannel,
    updateChannel,
    deleteChannel
} from "../controllers/Channels.js";

const router = express.Router();

// --------------------
// Create
// --------------------

// POST /create
//
// body:
//   user_id: integer (required)
//   workspace_id: integer (required)
//   name: string (required)
//   role: string (required)
//   is_private: boolean (required)
// return:
//   result: [channel]
router.post("/create", (request, response) => {
    createChannel(request).then((result) => {
        response.status(201).json({
            when: "Channels > CreateChannel",
            result: result,
            error: 0,
        });
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

// GET /read
//
// body:
//   id: integer (optional)
//   workspace_id: integer (optional)
//   name: string (optional)
//   role: string (optional)
//   is_private: boolean (optional)
//   user_id: integer (optional)
// return:
//   result: [channel]
router.get("/read", (request, response) => {
    readChannel(request).then((result) => {
        if (result !== "") {
            response.status(202).json({
                when: "Channels > ReadChannel",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Channels > ReadChannel",
                error: 1,
                error_message: "Channel not found",
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

// PUT /update
//
// body:
//   id: integer (required)
//   workspace_id: integer (optional)
//   name: string (optional)
//   role: string (optional)
//   is_private: boolean (optional)
//   user_id: integer (optional)
// return:
//   result: [channel]
router.put("/update", (request, response) => {
    updateChannel(request).then((result) => {
        if (result !== "") {
            response.status(202).json({
                when: "Channels > UpdateChannel",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Channels > UpdateChannel",
                error: 1,
                error_message: "Channel not found",
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

// DELETE /delete
//
// body:
//   id: integer (required)
// return:
//   result: [channel]
router.delete("/delete", (request, response) => {
    deleteChannel(request).then((result) => {
        if (result !== "") {
            response.status(202).json({
                when: "Channels > DeleteChannel",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Channels > DeleteChannel",
                error: 1,
                error_message: "Channel not found",
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

export default router;