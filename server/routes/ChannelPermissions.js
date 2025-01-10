import express from "express";

import {
    createChannelPermission,
    readChannelPermission,
    deleteChannelPermission,
} from "../controllers/ChannelPermissions.js";

const router = express.Router();

// POST /channels/permissions
//
// body:
//   user_id: number (required)
//   channel_id: number (required)
//   permission_id: number (required)
// return:
//   result: [channel_permission]
router.post("/", (request, response) => {
    createChannelPermission(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(201).json({
                when: "ChannelPermissions > CreateChannelPermission",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "ChannelPermissions > CreateChannelPermission",
                error: result.error || 1,
                error_message: result.error_message || "Could not create channel permission",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "ChannelPermissions > CreateChannelPermission",
            error: 1,
            error_message: error.message,
        });
    });
});

// GET /channels/permissions
//
// query:
//   user_id: number (optional)
//   channel_id: number (optional)
//   permission_id: number (optional)
// return:
//   result: [channel_permission]
router.get("/", (request, response) => {
    readChannelPermission(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "ChannelPermission > ReadChannelPermission",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "ChannelPermission > ReadChannelPermission",
                error: result.error || 1,
                error_message: result.error_message || "Could not read channel permission",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "ChannelPermission > ReadChannelPermission",
            error: 1,
            error_message: error.message,
        });
    });
});

// GET /channels/permissions/user/:user_id/channel/:channel_id/permission/:permission_id
//
// params:
//   user_id: number (required)
//   channel_id: number (required)
//   permission_id: number (required)
// return:
//   result: [channel_permission]
router.get("/user/:user_id/channel/:channel_id/permission/:permission_id", (request, response) => {
    readChannelPermission(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "ChannelPermission > ReadChannelPermission",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "ChannelPermission > ReadChannelPermission",
                error: result.error || 1,
                error_message: result.error_message || "Could not read channel permission",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "ChannelPermission > ReadChannelPermission",
            error: 1,
            error_message: error.message,
        });
    });
});

// DELETE /channels/permissions/user/:user_id/channel/:channel_id/permission/:permission_id
//
// param:
//   user_id: number (required)
//   channel_id: number (required)
//   permission_id: number (required)
// return:
//   result: [channel_permission]
router.delete("/user/:user_id/channel/:channel_id/permission/:permission_id", (request, response) => {
    deleteChannelPermission(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "ChannelPermissions > DeleteChannelPermission",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "ChannelPermissions > DeleteChannelPermission",
                error: result.error || 1,
                error_message: result.error_message || "Could not delete channel permission",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "ChannelPermissions > DeleteChannelPermission",
            error: 1,
            error_message: error.message,
        });
    });
});

export default router;