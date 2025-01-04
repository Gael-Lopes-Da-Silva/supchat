import express from "express";
const router = express.Router();

import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import {
    createUser,
    loginUser,
    readUser,
    updateUser,
    deleteUser,
    restoreUser,
} from "../controllers/Users.js";

// POST /users
//
// body:
//   username: string (required)
//   email: string (required)
//   password: string (required)
//   status_id: number (optional)
//   link_google: boolean (optional)
//   link_facebook: boolean (optional)
//   confirm_token: string (optional)
//   password_reset_token: string (optional)
// return:
//   result: [user]
router.post("/", (request, response) => {
    createUser(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(201).json({
                when: "Users > CreateUser",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Users > CreateUser",
                error: result.error || 1,
                error_message: result.error_message || "Could not create user",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Users > CreateUser",
            error: 1,
            error_message: error.message,
        });
    });
});

// POST /users/login
//
// body:
//   email: string (required)
//   password: string (optional)
// return:
//   token: string
//   result: [user]
router.post("/login", (request, response) => {
    loginUser(request).then((result) => {
        if (!result.error && result !== "") {
            const token = jsonwebtoken.sign({ id: result.id }, process.env.SECRET, { expiresIn: "24h" });

            response.status(202).json({
                when: "Users > LoginUser",
                token: token,
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Users > LoginUser",
                error: result.error || 1,
                error_message: result.error_message || "Could not login user",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Users > LoginUser",
            error: 1,
            error_message: error.message,
        });
    });
});

// GET /users
//
// query:
//   username: string (optional)
//   email: string (optional)
//   password: string (optional)
//   status_id: number (optional)
//   link_google: boolean (optional)
//   link_facebook: boolean (optional)
//   confirm_token: string (optional)
//   password_reset_token: string (optional)
// return:
//   result: [user]
router.get("/", (request, response) => {
    readUser(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "Users > ReadUser",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Users > ReadUser",
                error: result.error || 1,
                error_message: result.error_message || "Could not read user",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Users > ReadUser",
            error: 1,
            error_message: error.message,
        });
    });
});

// GET /users/:id
//
// param:
//   id: number (required)
// return:
//   result: [user]
router.get("/:id", (request, response) => {
    readUser(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "Users > ReadUser",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Users > ReadUser",
                error: result.error || 1,
                error_message: result.error_message || "Could not read user",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Users > ReadUser",
            error: 1,
            error_message: error.message,
        });
    });
});

// PUT /users/:id
//
// param:
//   id: number (required)
// body:
//   username: string (optional)
//   email: string (optional)
//   password: string (optional)
//   status_id: number (optional)
//   link_google: boolean (optional)
//   link_facebook: boolean (optional)
//   confirm_token: string (optional)
//   password_reset_token: string (optional)
// return:
//   result: [user]
router.put("/:id", (request, response) => {
    updateUser(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "Users > UpdateUser",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Users > UpdateUser",
                error: result.error || 1,
                error_message: result.error_message || "Could not update user",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Users > UpdateUser",
            error: 1,
            error_message: error.message,
        });
    });
});

// DELETE /users/:id
//
// param:
//   id: number (required)
// return:
//   result: [user]
router.delete("/:id", (request, response) => {
    deleteUser(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "Users > DeleteUser",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Users > DeleteUser",
                error: result.error || 1,
                error_message: result.error_message || "Could not delete user",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Users > DeleteUser",
            error: 1,
            error_message: error.message,
        });
    });
});

// PATCH /users/:id
//
// param:
//   id: number (required)
// return:
//   result: [user]
router.patch("/:id", (request, response) => {
    restoreUser(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "Users > RestoreUser",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Users > RestoreUser",
                error: result.error || 1,
                error_message: result.error_message || "Could not restore user",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Users > RestoreUser",
            error: 1,
            error_message: error.message,
        });
    });
});

export default router;