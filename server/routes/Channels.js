import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

import {
    createChannel,
    readChannel,
    updateChannel,
    deleteChannel,
    restoreChannel,
    uploadFileToChannel,
    getUsersForReaction
} from "../controllers/Channels.js";

import { validateCreateChannel } from "../validators/channels.js";
import { handleValidationErrors } from "../middlewares/Validate.js";
import { ensureAuthenticated } from "../middlewares/JwtAuth.js";

const router = express.Router();
router.use(ensureAuthenticated);

// POST /channels
//
// body:
//   user_id: number (required)
//   workspace_id: number (required)
//   name: string (required)
//   is_private: boolean (optional)
// return:
//   result: [channel]

router.post("/", validateCreateChannel, handleValidationErrors, (request, response) => {
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



// GET /channels/getUsersReactions
//
// query:
//   message_id: number (required)
//   emoji: string (required)
// return:
//   users: [string] (liste des usernames ayant réagi avec cet emoji)
router.get("/getUsersReactions", async (req, res) => {
  const { message_id, emoji } = req.query;

  if (!message_id || !emoji) {
    return res.status(400).json({
      when: "Channels > GetUsersReactions",
      error: 1,
      error_message: "message_id et emoji sont requis.",
    });
  }

  try {
    const users = await getUsersForReaction({ message_id, emoji });

    return res.status(200).json({
      when: "Channels > GetUsersReactions",
      users,
      error: 0,
    });
  } catch (error) {
    return res.status(500).json({
      when: "Channels > GetUsersReactions",
      error: 1,
      error_message: error.message,
    });
  }
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


// POST /channels/upload
//
// body (multipart/form-data):
//   file: Fichier (obligatoire)
//   channel_id: number (obligatoire)
//   user_id: number (obligatoire)
// return:
//   { success: true, fileUrl: "/uploads/..." }


const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), async (req, res) => {
    const result = await uploadFileToChannel(req.file, req.body);

    if (!result.error) {
        return res.status(201).json({
            when: "Channels > UploadFileToChannel",
            result: result.result,
            error: 0,
        });
    } else {
        return res.status(400).json({
            when: "Channels > UploadFileToChannel",
            error: result.error,
            error_message: result.error_message,
        });
    }
});




export default router;