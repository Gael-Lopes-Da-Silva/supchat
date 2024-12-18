import express from "express";
import dotenv from "dotenv/config";

const router = express.Router();

import {
    createUser,
    loginUser,
    readUser,
    updateUser,
    deleteUser
} from "../controllers/Users.js";

// --------------------
// Create
// --------------------

// POST /create
//
// body:
//   username: string (required)
//   email: string (required)
//   password: string (required)
//   status: string (required)
//   link_google: boolean (optional)
//   link_facebook: boolean (optional)
// return:
//   result: [user]
router.post("/create", (request, response) => {
    createUser(request).then((result) => {
        response.status(201).json({
            when: "Users > CreateUser",
            result: result,
            error: 0,
        });
    }).catch((error) => {
        response.status(500).json({
            when: "Users > CreateUser",
            error: 1,
            error_message: error.message,
        });
    });
});

// --------------------
// Read
// --------------------

// GET /login
//
// body:
//   email: string (required)
//   password: string (optional)
// return:
//   token: string
//   result: [user]
router.get("/login", (request, response) => {
    loginUser(request).then((result) => {
        if (result !== "") {
            const token = jsonwebtoken.sign({ id: result[0].id }, process.env.SECRET, { expiresIn: "24h" });

            response.status(202).json({
                when: "Users > LoginUser",
                token: token,
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Users > LoginUser",
                error: 1,
                error_message: "User not found",
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

// GET /read
//
// body:
//   id: integer (optional)
//   username: string (optional)
//   email: string (optional)
//   password: string (optional)
//   status: string (optional)
//   link_google: boolean (optional)
//   link_facebook: boolean (optional)
// return:
//   result: [user]
router.get("/read", (request, response) => {
    readUser(request).then((result) => {
        if (result !== "") {
            response.status(202).json({
                when: "Users > ReadUser",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Users > ReadUser",
                error: 1,
                error_message: "User not found",
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

// --------------------
// Update
// --------------------

// PUT /update
//
// body:
//   id: integer (required)
//   username: string (optional)
//   email: string (optional)
//   password: string (optional)
//   status: string (optional)
//   link_google: boolean (optional)
//   link_facebook: boolean (optional)
// return:
//   result: [user]
router.put("/update", (request, response) => {
    updateUser(request).then((result) => {
        if (result !== "") {
            response.status(202).json({
                when: "Users > UpdateUser",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Users > UpdateUser",
                error: 1,
                error_message: "User not found",
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

// --------------------
// Delete
// --------------------

// DELETE /delete
//
// body:
//   id: integer (required)
// return:
//   result: [user]
router.delete("/delete", (request, response) => {
    deleteUser(request).then((result) => {
        if (result !== "") {
            response.status(202).json({
                when: "Users > DeleteUser",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Users > DeleteUser",
                error: 1,
                error_message: "User not found",
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

export default router;