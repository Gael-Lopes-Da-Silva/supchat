import express from "express";
import dotenv from "dotenv/config";

import {
    createUser,
    loginUser,
    getUserById,
    getUserByEmail,
    getAllUsers,
    updateUser,
    linkUserGoogle,
    linkUserFacebook,
    deleteUser
} from "../controllers/Users.js";

const router = express.Router();

// --------------------
// Create
// --------------------

// body:
//   username: string
//   email: string
//   password: string
// return:
//   ...
router.post("/create", (request, response) => {
    createUser(request).then((result) => {
        response.status(201).json({
            when: "Users > Create",
            error: 0,
        });
    }).catch((error) => {
        response.status(500).json({
            when: "Users > Create",
            error: 1,
            error_message: error.message,
        });
    });
});

// --------------------
// Read
// --------------------

// body:
//   email: string
//   password: string
// return:
//   token: string
//   result: [user]
router.get("/login", (request, response) => {
    loginUser(request).then((result) => {
        if (result !== "") {
            const token = jsonwebtoken.sign({ id: result[0].id }, process.env.SECRET, { expiresIn: "24h" });

            response.status(202).json({
                when: "Users > Login",
                token: token,
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Users > Login",
                error: 1,
                error_message: "User not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Users > Login",
            error: 1,
            error_message: error.message,
        });
    });
});

// body:
//   email: string
// return:
//   token: string
//   result: [user]
router.get("/loginWithoutPassword", (request, response) => {
    loginUser(request).then((result) => {
        if (result !== "") {
            const token = jsonwebtoken.sign({ id: result[0].id }, process.env.SECRET, { expiresIn: "24h" });

            response.status(202).json({
                when: "Users > LoginWithoutPassword",
                token: token,
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Users > LoginWithoutPassword",
                error: 1,
                error_message: "User not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Users > LoginWithoutPassword",
            error: 1,
            error_message: error.message,
        });
    });
});

// body:
//   id: integer
// return:
//   result: [user]
router.get("/getById", (request, response) => {
    getUserById(request).then((result) => {
        if (result !== "") {
            response.status(202).json({
                when: "Users > GetById",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Users > GetById",
                error: 1,
                error_message: "User not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Users > GetById",
            error: 1,
            error_message: error.message,
        });
    });
});

// body:
//   email: string
// return:
//   result: [user]
router.get("/getByEmail", (request, response) => {
    getUserByEmail(request).then((result) => {
        if (result !== "") {
            response.status(202).json({
                when: "Users > GetByEmail",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Users > GetByEmail",
                error: 1,
                error_message: "User not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Users > GetByEmail",
            error: 1,
            error_message: error.message,
        });
    });
});

// body:
//   ...
// return:
//   result: [user]
router.get("/getAll", (request, response) => {
    getAllUsers(request).then((result) => {
        if (result !== "") {
            response.status(202).json({
                when: "Users > GetAll",
                result: result,
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Users > GetAll",
                error: 1,
                error_message: "User not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Users > GetAll",
            error: 1,
            error_message: error.message,
        });
    });
});

// --------------------
// Update
// --------------------

// body:
//   id: integer
//   username: string
//   email: string
//   password: string
// return:
//   ...
router.put("/update", (request, response) => {
    updateUser(request).then((result) => {
        if (result !== "") {
            response.status(202).json({
                when: "Users > Update",
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Users > Update",
                error: 1,
                error_message: "User not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Users > Update",
            error: 1,
            error_message: error.message,
        });
    });
});

// body:
//   id: integer
// return:
//   ...
router.put("/linkGoogle", (request, response) => {
    linkUserGoogle(request).then((result) => {
        if (result !== "") {
            response.status(202).json({
                when: "Users > LinkGoogle",
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Users > LinkGoogle",
                error: 1,
                error_message: "User not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Users > LinkGoogle",
            error: 1,
            error_message: error.message,
        });
    });
});

// body:
//   id: integer
// return:
//   ...
router.put("/linkFacebook", (request, response) => {
    linkUserFacebook(request).then((result) => {
        if (result !== "") {
            response.status(202).json({
                when: "Users > LinkFacebook",
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Users > LinkFacebook",
                error: 1,
                error_message: "User not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Users > LinkFacebook",
            error: 1,
            error_message: error.message,
        });
    });
});

// --------------------
// Delete
// --------------------

// body:
//   id: integer
// return:
//   ...
router.delete("/delete", (request, response) => {
    deleteUser(request).then((result) => {
        if (result !== "") {
            response.status(202).json({
                when: "Users > Delete",
                error: 0,
            });
        } else {
            response.status(404).json({
                when: "Users > Delete",
                error: 1,
                error_message: "User not found",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            when: "Users > Delete",
            error: 1,
            error_message: error.message,
        });
    });
});

export default router;