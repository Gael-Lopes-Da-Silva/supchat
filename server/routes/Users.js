import express from "express";
import jsonwebtoken from "jsonwebtoken";
import passport from "passport";
import { validateUserCreation, validateUserLogin } from "../validators/users.js";
import { handleValidationErrors } from "../middlewares/Validate.js";
import { verifyGoogleToken, verifyFacebookToken, handleGoogleAuth, handleFacebookAuth } from "../services/MobileAuthService.js";

import {
  createUser,
  deleteUser,
  loginUser,
  readUser,
  readUserByEmail,
  restoreUser,
  updateUser,
  getUserProviders,
  unlinkProvider,
  exportUserData
} from "../controllers/Users.js";

const router = express.Router();

const WEB_URL = process.env.

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

// ---------- AUTH GOOGLE / FACEBOOK WEB ----------

router.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: `${WEB_URL}/login?error=Erreur Facebook OAuth`,
  }),
  (req, res) => {
    res.redirect(`${WEB_URL}/login?token=${req.user?.token || ""}`);
  }
);

router.get("/auth/facebook/link", (req, res, next) => {
  const token = req.query.token;
  if (!token) {
    return res.redirect(`${WEB_URL}/settings?error=Vous devez être connecté.`);
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
    return res.redirect(`${WEB_URL}/settings?error=Token invalide.`);
  }
});

router.get(
  "/auth/facebook/link/callback",
  passport.authenticate("facebook-link", {
    session: false,
    failureRedirect: `${WEB_URL}/settings?error=Erreur Facebook OAuth`,
  }),
  (req, res) => {
    res.redirect(`${WEB_URL}/settings?success=Compte Facebook lié avec succès.`);
  }
);

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${WEB_URL}/login?error=Erreur Google OAuth`,
  }),
  (req, res) => {
    res.redirect(`${WEB_URL}/login?token=${req.user?.token || ""}`);
  }
);

router.get("/auth/google/link", (req, res, next) => {
  const token = req.query.token;
  if (!token) {
    return res.redirect(`${WEB_URL}/settings?error=Vous devez être connecté.`);
  }

  try {
    const user = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    req.linkUser = user; 
    passport.authenticate("google-link", {
      scope: ["profile", "email"],
      session: false,
      state: token,
    })(req, res, next);
  } catch (err) {
    return res.redirect(`${WEB_URL}/settings?error=Token invalide.`);
  }
});

router.get(
  "/auth/google/link/callback",
  passport.authenticate("google-link", {
    session: false,
    failureRedirect: `${WEB_URL}/settings?error=Erreur Google OAuth`,
  }),
  (req, res) => {
    const token = jsonwebtoken.sign(
      { id: req.user.id, email: req.user.email, provider: "google" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.redirect(`${WEB_URL}/settings?success=Compte Google lié avec succès&token=${token}`);
  }
);

router.get("/:id/providers", getUserProviders);
router.post("/unlink-provider", unlinkProvider);


router.get("/:id/export", exportUserData);

// ---------- AUTH MOBILE ----------

router.post("/auth/google/mobile", async (req, res) => {
  try {
    const { token } = req.body;
    const profile = await verifyGoogleToken(token);
    const result = await handleGoogleAuth(profile);
    
    res.status(200).json({
      token: result.token,
      result: result.user,
      error: 0,
    });
  } catch (err) {
    res.status(400).json({ error: 1, error_message: err.message });
  }
});

router.post("/auth/facebook/mobile", async (req, res) => {
  try {
    const { token } = req.body;
    const profile = await verifyFacebookToken(token);
    const result = await handleFacebookAuth(profile);
    
    res.status(200).json({
      token: result.token,
      result: result.user,
      error: 0,
    });
  } catch (err) {
    res.status(400).json({ error: 1, error_message: err.message });
  }
});

router.post("/auth/google/link/mobile", async (req, res) => {
  try {
    const { token } = req.body;
    const userToken = req.headers.authorization?.split(" ")[1];
    
    if (!userToken) {
      return res.status(401).json({ error: 1, error_message: "Non authentifié" });
    }

    let localUser;
    try {
      localUser = jsonwebtoken.verify(userToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 1, error_message: "Token JWT invalide" });
    }

    const profile = await verifyGoogleToken(token);
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const existingGoogleAccount = await connection.query(
        "SELECT user_id FROM providers WHERE provider_id = ? AND provider = 'google'",
        [profile.googleId]
      );

      if (existingGoogleAccount.length > 0) {
        const linkedUserId = existingGoogleAccount[0].user_id;
        const linkedLocalAccount = await connection.query(
          "SELECT user_id FROM providers WHERE user_id = ? AND provider IS NULL",
          [linkedUserId]
        );

        if (linkedLocalAccount.length > 0 && linkedUserId !== localUser.id) {
          await connection.rollback();
          return res.status(400).json({ 
            error: 1, 
            error_message: "Ce compte Google est déjà lié à un autre compte local." 
          });
        }
      }

      const existingEntry = await connection.query(
        "SELECT * FROM providers WHERE provider_id = ? AND provider = 'google'",
        [profile.googleId]
      );

      if (existingEntry.length > 0) {
        const updateResult = await connection.query(
          `UPDATE providers 
           SET original_user_id = user_id, user_id = ? 
           WHERE provider_id = ? AND provider = 'google'`,
          [localUser.id, profile.googleId]
        );

        if (updateResult.affectedRows === 0) {
          await connection.rollback();
          return res.status(400).json({ 
            error: 1, 
            error_message: "Erreur lors de la fusion des comptes." 
          });
        }
      } else {
        await connection.query(
          "INSERT INTO providers (user_id, provider_id, provider) VALUES (?, ?, 'google')",
          [localUser.id, profile.googleId]
        );
      }

      await connection.commit();
      res.status(200).json({ error: 0 });
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ error: 1, error_message: error.message });
    } finally {
      connection.release();
    }
  } catch (err) {
    res.status(400).json({ error: 1, error_message: err.message });
  }
});

router.post("/auth/facebook/link/mobile", async (req, res) => {
  try {
    const { token } = req.body;
    const userToken = req.headers.authorization?.split(" ")[1];
    
    if (!userToken) {
      return res.status(401).json({ error: 1, error_message: "Non authentifié" });
    }

    let localUser;
    try {
      localUser = jsonwebtoken.verify(userToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 1, error_message: "Token JWT invalide" });
    }

    const profile = await verifyFacebookToken(token);
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const existingFacebookAccount = await connection.query(
        "SELECT user_id FROM providers WHERE provider_id = ? AND provider = 'facebook'",
        [profile.facebookId]
      );

      if (existingFacebookAccount.length > 0) {
        const linkedUserId = existingFacebookAccount[0].user_id;
        const linkedLocalAccount = await connection.query(
          "SELECT user_id FROM providers WHERE user_id = ? AND provider IS NULL",
          [linkedUserId]
        );

        if (linkedLocalAccount.length > 0 && linkedUserId !== localUser.id) {
          await connection.rollback();
          return res.status(400).json({ 
            error: 1, 
            error_message: "Ce compte Facebook est déjà lié à un autre compte local." 
          });
        }
      }

      const existingEntry = await connection.query(
        "SELECT * FROM providers WHERE provider_id = ? AND provider = 'facebook'",
        [profile.facebookId]
      );

      if (existingEntry.length > 0) {
        const updateResult = await connection.query(
          `UPDATE providers 
           SET original_user_id = user_id, user_id = ? 
           WHERE provider_id = ? AND provider = 'facebook'`,
          [localUser.id, profile.facebookId]
        );

        if (updateResult.affectedRows === 0) {
          await connection.rollback();
          return res.status(400).json({ 
            error: 1, 
            error_message: "Erreur lors de la fusion des comptes." 
          });
        }
      } else {
        await connection.query(
          "INSERT INTO providers (user_id, provider_id, provider) VALUES (?, ?, 'facebook')",
          [localUser.id, profile.facebookId]
        );
      }

      await connection.commit();
      res.status(200).json({ error: 0 });
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ error: 1, error_message: error.message });
    } finally {
      connection.release();
    }
  } catch (err) {
    res.status(400).json({ error: 1, error_message: err.message });
  }
});

router.get("/by-email/:email", async (req, res) => {
  try {
    const result = await readUserByEmail(req.params.email);
    if (!result.error) {
      return res.status(200).json({ when: "Users > ReadUserByEmail", result: result.result, error: 0 });
    }
    res.status(404).json({ when: "Users > ReadUserByEmail", error: result.error, error_message: result.error_message });
  } catch (err) {
    res.status(500).json({ when: "Users > ReadUserByEmail", error: 1, error_message: err.message });
  }
});

export default router;
