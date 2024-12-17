import express from "express";

import {
    createUser
} from "../controllers/Users.js";

const router = express.Router();

router.get("/create", (request, response) => {
    createUser(request).then(() => {
        response.status(201).json({
            when: "Creating user",
            error: 0,
        });
    }).catch((error) => {
        response.status(500).json({
            when: "Creating user",
            error: 1,
            error_message: error,
        });
    });
});

export default router;