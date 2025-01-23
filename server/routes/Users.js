import express from "express";
import passport from "passport";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv/config";

import {
    createUser,
    loginUser,
    readUser,
    updateUser,
    deleteUser,
    confirmUser,
} from "../controllers/Users.js";

const router = express.Router();

// mail confirmatoion
router.get('/confirm', async (req, res) => {
    const { token } = req.query;

    try {
        const result = await confirmUser(token);

        if (result.error) {
            return res.status(400).json(result);
        }

        res.redirect(`http://localhost:5000/login?confirmed=true`);
    } catch (error) {
        console.error('Erreur lors de la confirmation du compte:', error.message);
        res.status(500).json({ error: 1, error_message: 'Erreur serveur' });
    }
});

  

// OAuth Google
router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/" }),
    (req, res) => {
        const userPayload = {
            id: req.user.id.toString(),
            username: req.user.username,
            provider: req.user.provider,
        };

        const token = jsonwebtoken.sign(userPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.redirect(`http://localhost:5000/login?token=${token}`);
    }
);

// OAuth Facebook
router.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", { session: false, failureRedirect: "/" }),
    (req, res) => {
        const userPayload = {
            id: req.user.id.toString(),
            username: req.user.username,
            provider: req.user.provider,
        };

        const token = jsonwebtoken.sign(userPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.redirect(`http://localhost:5000/login?token=${token}`);
    }
);

// createUser
router.post("/", async (req, res) => {
    try {
      const result = await createUser(req);
  
      if (result.error) {
        res.status(400).json(result);
      } else {
        res.status(201).json(result);
      }
    } catch (error) {
      console.error("Erreur interne lors de la création de l'utilisateur :", error.message);
      res.status(500).json(createErrorResponse(ERRORS.INTERNAL_SERVER_ERROR));
    }
  });
  

// loginUser
router.post("/login", async (req, res) => {
    try {
      const result = await loginUser(req);
  
      if (result.error) {
        res.status(400).json(result); 
      } else {
        res.status(200).json(result);
      }
    } catch (error) {
      console.error("Erreur interne lors de la connexion :", error.message);
      res.status(500).json(createErrorResponse(ERRORS.INTERNAL_SERVER_ERROR));
    }
  });
  

// readUser
router.get("/", (req, res) => {
    readUser(req)
        .then((result) => {
            if (!result.error) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ error: result.error, error_message: result.error_message });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 1, error_message: error.message });
        });
});

//readUser (par id..)
router.get("/:id", (req, res) => {
    readUser(req)
        .then((result) => {
            if (!result.error) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ error: result.error, error_message: result.error_message });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 1, error_message: error.message });
        });
});

// updateUser
router.put("/:id", (req, res) => {
    updateUser(req)
        .then((result) => {
            if (!result.error) {
                res.status(200).json(result);
            } else {
                res.status(400).json({ error: result.error, error_message: result.error_message });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 1, error_message: error.message });
        });
});

// deleteUser
router.delete("/:id", (req, res) => {
    deleteUser(req)
        .then((result) => {
            if (!result.error) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ error: result.error, error_message: result.error_message });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 1, error_message: error.message });
        });
});

// Gael, la restauration d’un utilisateur (via un deleted_at nul) n’est pas vrmt demandé comme une feature dans moodle donc pas besoin de route PATCH 
// (je sais parce que j'ai fait analyser mon pote GPT :D)

// En ce qui concerne la reinitialisation de mot de passe,
//je vois pas non plus de explicitement demandé dans moodle donc au pire on le fera en BONUS dès qu'on aura fini l'essentiel si ça te va :)


export default router;