import express from "express";

import {
    sendEmail,
} from "../../app/EmailHandler.js";

const router = express.Router();

// POST /email/send
//
// body:
//   to: string (required)
//   subject: string (required)
//   content: string (required)
// return:
//   result: [email]
router.post("/send", (request, response) => {
    sendEmail(request).then((result) => {
        if (result) {
            response.status(201).json({
                when: "Email > Send",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Users > CreateUser",
                error: result.error || 1,
                error_message: result.error_message || "Could not send email",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Email > Send",
            error: 1,
            error_message: error.message,
        });
    });
});

export default router;