import express from "express";

import {
    createUser,
    deleteUser,
    updateUser,
    loginUser
} from "../controllers/Users.js";

const router = express.Router();

// body:
//   username: string
//   email: string
//   password: string
router.post("/create", (request, response) => {
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

// body:
//   email: string
//   password: string
router.get("/login", (request, response) => {
    loginUser(request).then((result) => {
        if (result !== "") {
            response.status(202).json({
                when: "Loging user",
                result: user,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Loging user",
                error: 1,
                error_message: error,
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Loging user",
            error: 1,
            error_message: error,
        });
    });
});

// body:
//   id: integer
router.delete("/delete", (request, response) => {
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

// body:
//   id: integer
//   username: string
//   email: string
//   password: string
router.put("/update", (request, response) => {
    updateUser(request).then((result) => {
        if (result !== "") {
            response.status(202).json({
                when: "Updating user",
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Updating user",
                error: 1,
                error_message: error,
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Updating user",
            error: 1,
            error_message: error,
        });
    });
});

export default router;