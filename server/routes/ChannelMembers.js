import express from "express";

import {
    createChannelMember,
    readChannelMember,
    updateChannelMember,
    deleteChannelMember,
    restoreChannelMember,
} from "../controllers/ChannelMembers.js";

const router = express.Router();

// --------------------
// Create
// --------------------

// POST /channels/members/create
//
// body:
//   user_id: number (required)
//   channel_id: number (required)
//   role_id: number (required)
// return:
//   result: [channel_member]
router.post("/create", (request, response) => {
    createChannelMember(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(201).json({
                when: "ChannelMembers > CreateChannelMember",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "ChannelMembers > CreateChannelMember",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not create channel member",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "ChannelMembers > CreateChannelMember",
            error: 1,
            error_message: error.message,
        });
    });
});

// --------------------
// Read
// --------------------

// GET /channels/members/read
//
// body:
//   id: number (optional)
//   user_id: number (optional)
//   channel_id: number (optional)
//   role_id: number (optional)
// return:
//   result: [channel_member]
router.get("/read", (request, response) => {
    readChannelMember(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "ChannelMembers > ReadChannelMember",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "ChannelMembers > ReadChannelMember",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not read channel member",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "ChannelMembers > ReadChannelMember",
            error: 1,
            error_message: error.message,
        });
    });
});

// --------------------
// Update
// --------------------

// PUT /channels/members/update
//
// body:
//   id: number (required)
//   channel_id: number (optional)
//   user_id: number (optional)
//   role_id: number (optional)
// return:
//   result: [channel_member]
router.put("/update", (request, response) => {
    updateChannelMember(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "ChannelMembers > UpdateChannelMember",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "ChannelMembers > UpdateChannelMember",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not update channel member",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "ChannelMembers > UpdateChannelMember",
            error: 1,
            error_message: error.message,
        });
    });
});

// --------------------
// Delete
// --------------------

// DELETE /channels/members/delete
//
// body:
//   id: number (required)
// return:
//   result: [channel_member]
router.delete("/delete", (request, response) => {
    deleteChannelMember(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "ChannelMembers > DeleteChannelMember",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "ChannelMembers > DeleteChannelMember",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not delete channel member",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "ChannelMembers > DeleteChannelMember",
            error: 1,
            error_message: error.message,
        });
    });
});

// DELETE /channels/members/restore
//
// body:
//   id: number (required)
// return:
//   result: [channel_member]
router.delete("/restore", (request, response) => {
    restoreChannelMember(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "ChannelMembers > RestoreChannelMember",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "ChannelMembers > RestoreChannelMember",
                error: 1,
                error_message: result.error_message ? result.error_message : "Could not restore channel member",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "ChannelMembers > RestoreChannelMember",
            error: 1,
            error_message: error.message,
        });
    });
});

export default router;