import express from "express";

import {
    createChannel,
    createChannelMember,
    readChannel,
    readChannelMember,
    updateChannel,
    updateChannelMember,
    deleteChannel,
    deleteChannelMember
} from "../controllers/Channels.js";

const router = express.Router();

// --------------------
// Create
// --------------------

// POST /create
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

// POST /members/create
//
// body:
//   user_id: number (required)
//   channel_id: number (required)
//   role: number (required)
// return:
//   result: [channel_member]
router.post("/members/create", (request, response) => {
    createChannelMember(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(201).json({
                when: "Channels > CreateChannelMember",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Channels > CreateChannelMember",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not create channel member",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Channels > CreateChannelMember",
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
//   is_private: boolean (optional)
//   user_id: integer (optional)
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

// GET /members/read
//
// body:
//   id: number (optional)
//   user_id: number (optional)
//   channel_id: number (optional)
//   role: number (optional)
// return:
//   result: [channel_member]
router.get("/members/read", (request, response) => {
    readChannelMember(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "Channels > ReadChannelMember",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Channels > ReadChannelMember",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not read channel member",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Channels > ReadChannelMember",
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
//   is_private: boolean (optional)
//   user_id: integer (optional)
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

// PUT /members/update
//
// body:
//   id: number (required)
//   channel_id: number (optional)
//   user_id: number (optional)
//   role_id: number (optional)
// return:
//   result: [channel_member]
router.put("/members/update", (request, response) => {
    updateChannelMember(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "Channels > UpdateChannelMember",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Channels > UpdateChannelMember",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not update channel member",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Channels > UpdateChannelMember",
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

// DELETE /members/delete
//
// body:
//   id: number (required)
// return:
//   result: [channel_member]
router.delete("/members/delete", (request, response) => {
    deleteChannelMember(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "Channels > DeleteChannelMember",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Channels > DeleteChannelMember",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not delete channel member",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Channels > DeleteChannelMember",
            error: 1,
            error_message: error.message,
        });
    });
});

export default router;