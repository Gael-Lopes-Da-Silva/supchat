import express from "express";
import jsonwebtoken from "jsonwebtoken";
import passport from "passport";
import { validateUserCreation, validateUserLogin } from "../validators/users.js";
import { handleValidationErrors } from "../middlewares/Validate.js";

import {
  createUser,
  deleteUser,
  loginUser,
  readUser,
  restoreUser,
  updateUser,
  getUserProviders,
  unlinkProvider,
  exportUserData
} from "../controllers/Users.js";

const router = express.Router();

router.post("/", validateUserCreation, handleValidationErrors, async (req, res) => {
  try {
    const result = await createUser(req);
    if (!result.error) {
      return res.status(201).json({ when: "Users > CreateUser", result, error: 0 });
    }
    res.status(400).json({ when: "Users > CreateUser", error: result.error, error_message: result.error_message });
  } catch (err) {
    res.status(500).json({ when: "Users > CreateUser", error: 1, error_message: err.message });
  }
});

router.post("/login", validateUserLogin, handleValidationErrors, async (req, res) => {
  try {
    const result = await loginUser(req);
    if (!result.error) {
      return res.status(200).json({
        when: "Users > LoginUser",
        token: result.token,
        result: result.user,
        error: 0,
      });
    }
    res.status(400).json({ when: "Users > LoginUser", error: result.error, error_message: result.error_message });
  } catch (err) {
    res.status(500).json({ when: "Users > LoginUser", error: 1, error_message: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const result = await readUser(req);
    if (!result.error) return res.status(200).json({ when: "Users > ReadUser", result, error: 0 });
    res.status(404).json({ when: "Users > ReadUser", error: result.error, error_message: result.error_message });
  } catch (err) {
    res.status(500).json({ when: "Users > ReadUser", error: 1, error_message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await readUser(req);
    if (!result.error) return res.status(200).json({ when: "Users > ReadUser", result, error: 0 });
    res.status(404).json({ when: "Users > ReadUser", error: result.error, error_message: result.error_message });
  } catch (err) {
    res.status(500).json({ when: "Users > ReadUser", error: 1, error_message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const result = await updateUser(req);
    if (!result.error) return res.status(200).json({ when: "Users > UpdateUser", result, error: 0 });
    res.status(400).json({ when: "Users > UpdateUser", error: result.error, error_message: result.error_message });
  } catch (err) {
    res.status(500).json({ when: "Users > UpdateUser", error: 1, error_message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await deleteUser(req);
    if (!result.error) return res.status(200).json({ when: "Users > DeleteUser", result, error: 0 });
    res.status(404).json({ when: "Users > DeleteUser", error: result.error, error_message: result.error_message });
  } catch (err) {
    res.status(500).json({ when: "Users > DeleteUser", error: 1, error_message: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const result = await restoreUser(req);
    if (!result.error) return res.status(200).json({ when: "Users > RestoreUser", result, error: 0 });
    res.status(400).json({ when: "Users > RestoreUser", error: result.error, error_message: result.error_message });
  } catch (err) {
    res.status(500).json({ when: "Users > RestoreUser", error: 1, error_message: err.message });
  }
});

// ---------- AUTH GOOGLE / FACEBOOK ----------

router.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: "http://localhost:5000/login?error=Erreur Facebook OAuth",
  }),
  (req, res) => {
    res.redirect(`http://localhost:5000/login?token=${req.user?.token || ""}`);
  }
);

router.get("/auth/facebook/link", (req, res, next) => {
  const token = req.query.token;
  if (!token) {
    return res.redirect("http://localhost:5000/settings?error=Vous devez être connecté.");
  }

  try {
    const user = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    req.linkUser = user; 
    passport.authenticate("facebook-link", {
      scope: ["email", "public_profile"],
      session: false,
      state: token,
    })(req, res, next);
  } catch (err) {
    return res.redirect("http://localhost:5000/settings?error=Token invalide.");
  }
});

router.get(
  "/auth/facebook/link/callback",
  passport.authenticate("facebook-link", {
    session: false,
    failureRedirect: "http://localhost:5000/settings?error=Erreur Facebook OAuth",
  }),
  (req, res) => {
    res.redirect("http://localhost:5000/settings?success=Compte Facebook lié avec succès.");
  }
);

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5000/login?error=Erreur Google OAuth",
  }),
  (req, res) => {
    res.redirect(`http://localhost:5000/login?token=${req.user?.token || ""}`);
  }
);

router.get("/auth/google/link", (req, res, next) => {
  const token = req.query.token;
  if (!token) {
    return res.redirect("http://localhost:5000/settings?error=Vous devez être connecté.");
  }

  try {
    const user = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    req.linkUser = user; 
    passport.authenticate("google-link", {
      scope: ["profile", "email"],
      session: false,
       state: token
    })(req, res, next);
  } catch (err) {
    return res.redirect("http://localhost:5000/settings?error=Token invalide.");
  }
});

router.get(
  "/auth/google/link/callback",
  passport.authenticate("google-link", {
    session: false,
    failureRedirect: "http://localhost:5000/settings?error=Erreur Google OAuth",
  }),
  (req, res) => {
    const token = jsonwebtoken.sign(
      { id: req.user.id, email: req.user.email, provider: "google" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.redirect(`http://localhost:5000/settings?success=Compte Google lié avec succès&token=${token}`);
  }
);

router.get("/:id/providers", getUserProviders);
router.post("/unlink-provider", unlinkProvider);


router.get("/:id/export", exportUserData);



export default router;
