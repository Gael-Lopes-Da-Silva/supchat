import express from "express";
import jsonwebtoken from "jsonwebtoken";
import passport from "passport";

import {
    createUser,
    deleteUser,
    loginUser,
    readUser,
    restoreUser,
    updateUser,
} from "../controllers/Users.js";

const router = express.Router();

// POST /users
//
// body:
//   username: string (required)
//   email: string (required)
//   password: string (required)
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

// GET /users
//
// query:
//   username: string (optional)
//   email: string (optional)
//   password: string (optional)
//   provider: string (optional)
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


// POST /users/login
//
// body:
//   email: string (required)
//   password: string (required)
// return:
//   token: string
//   result: [user]
router.post("/login", (request, response) => {
    loginUser(request).then((result) => {
        if (!result.error && result !== "") {
            response.status(202).json({
                when: "Users > LoginUser",
                token: result.token,
                result: result.user,
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

// NOTE: Pas besoin d'une route pour confirmer. Tout est faisable avec un read et un update (plus chiant mais plus lisible)

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" }));
router.get("/auth/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/" }), (request, response) => {
    const userPayload = {
        id: request.user.id.toString(),
        username: request.user.username,
        provider: request.user.provider,
    };

    const token = jsonwebtoken.sign(userPayload, process.env.JWT_SECRET, { expiresIn: "1h" });
    response.redirect(`http://localhost:5000/login?token=${token}`);
});

router.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));
router.get("/auth/facebook/callback", passport.authenticate("facebook", { session: false, failureRedirect: "/" }), (request, response) => {
    const userPayload = {
        id: request.user.id.toString(),
        username: request.user.username,
        provider: request.user.provider,
    };

    const token = jsonwebtoken.sign(userPayload, process.env.JWT_SECRET, { expiresIn: "1h" });
    response.redirect(`http://localhost:5000/login?token=${token}`);
}
);

export default router;