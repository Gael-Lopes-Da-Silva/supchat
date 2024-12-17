import express from "express";
import dotenv from "dotenv/config";

import {
    createUser,
    deleteUser,
    updateUser,
    loginUser,
    getUser,
    getUserByEmail,
    getAllUser
} from "../controllers/Users.js";

const router = express.Router();

// body:
//   username: string
//   email: string
//   password: string
//   google: boolean
//   facebook: boolean
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
            error_message: error.message,
        });
    });
});

// body:
//   email: string
//   password: string
router.get("/login", (request, response) => {
    loginUser(request).then((result) => {
        if (result !== "") {
            const token = jsonwebtoken.sign({ id: result[0].id }, process.env.SECRET, { expiresIn: "24h" });

            response.status(202).json({
                when: "Loging user",
                token: token,
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Loging user",
                error: 1,
                error_message: "Invalid email or password",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Loging user",
            error: 1,
            error_message: error.message,
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
                error_message: "User not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Deleting user",
            error: 1,
            error_message: error.message,
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
                error_message: "User not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Updating user",
            error: 1,
            error_message: error.message,
        });
    });
});

// body:
//   id: integer
router.get("/get", (request, response) => {
    getUser(request).then((result) => {
        if (result !== "") {
            response.status(202).json({
                when: "Get user",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Get user",
                error: 1,
                error_message: "User not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Get user",
            error: 1,
            error_message: error.message,
        });
    });
});

// body:
//   id: integer
router.get("/getByEmail", (request, response) => {
    getUserByEmail(request).then((result) => {
        if (result !== "") {
            response.status(202).json({
                when: "Get user by email",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Get user by email",
                error: 1,
                error_message: "User not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Get user by email",
            error: 1,
            error_message: error.message,
        });
    });
});

// body:
//   ...
router.get("/get_all", (request, response) => {
    getAllUser(request).then((result) => {
        if (result !== "") {
            response.status(202).json({
                when: "Get all user",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Get all user",
                error: 1,
                error_message: "User not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Get all user",
            error: 1,
            error_message: error.message,
        });
    });
});

export default router;