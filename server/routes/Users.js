import express from "express";

import {
    createUser,
    deleteUser
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

router.get("/delete", (request, response) => {
    deleteUser(request).then((result) => {
        if (result !== "") {
            response.status(202).json({
                when: "Deleting user",
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Deleting user",
                error: 1,
                error_message: error,
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Deleting user",
            error: 1,
            error_message: error,
        });
    });
});

export default router;