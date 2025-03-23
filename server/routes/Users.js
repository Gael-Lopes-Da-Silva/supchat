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
  getUserProviders,
  unlinkProvider,
} from "../controllers/Users.js";

const router = express.Router();

router.post("/", async (request, response) => {
  console.log("🔍 POST /users :", request.body);

  createUser(request)
    .then((result) => {
      if (!result.error) {
        response
          .status(201)
          .json({ when: "Users > CreateUser", result, error: 0 });
      } else {
        response
          .status(400)
          .json({
            when: "Users > CreateUser",
            error: result.error,
            error_message: result.error_message,
          });
      }
    })
    .catch((error) => {
      response
        .status(500)
        .json({
          when: "Users > CreateUser",
          error: 1,
          error_message: error.message,
        });
    });
});

router.post("/login", (request, response) => {
  loginUser(request)
    .then((result) => {
      if (!result.error) {
        response
          .status(200)
          .json({
            when: "Users > LoginUser",
            token: result.token,
            result: result.user,
            error: 0,
          });
      } else {
        response
          .status(400)
          .json({
            when: "Users > LoginUser",
            error: result.error,
            error_message: result.error_message,
          });
      }
    })
    .catch((error) => {
      response
        .status(500)
        .json({
          when: "Users > LoginUser",
          error: 1,
          error_message: error.message,
        });
    });
});

router.get("/", (request, response) => {
  readUser(request)
    .then((result) => {
      if (!result.error) {
        response
          .status(200)
          .json({ when: "Users > ReadUser", result, error: 0 });
      } else {
        response
          .status(404)
          .json({
            when: "Users > ReadUser",
            error: result.error,
            error_message: result.error_message,
          });
      }
    })
    .catch((error) => {
      response
        .status(500)
        .json({
          when: "Users > ReadUser",
          error: 1,
          error_message: error.message,
        });
    });
});

router.get("/:id", (request, response) => {
  readUser(request)
    .then((result) => {
      if (!result.error) {
        response
          .status(200)
          .json({ when: "Users > ReadUser", result, error: 0 });
      } else {
        response
          .status(404)
          .json({
            when: "Users > ReadUser",
            error: result.error,
            error_message: result.error_message,
          });
      }
    })
    .catch((error) => {
      response
        .status(500)
        .json({
          when: "Users > ReadUser",
          error: 1,
          error_message: error.message,
        });
    });
});

router.put("/:id", (request, response) => {
  updateUser(request)
    .then((result) => {
      if (!result.error) {
        response
          .status(200)
          .json({ when: "Users > UpdateUser", result, error: 0 });
      } else {
        response
          .status(400)
          .json({
            when: "Users > UpdateUser",
            error: result.error,
            error_message: result.error_message,
          });
      }
    })
    .catch((error) => {
      response
        .status(500)
        .json({
          when: "Users > UpdateUser",
          error: 1,
          error_message: error.message,
        });
    });
});

router.delete("/:id", (request, response) => {
  deleteUser(request)
    .then((result) => {
      if (!result.error) {
        response
          .status(200)
          .json({ when: "Users > DeleteUser", result, error: 0 });
      } else {
        response
          .status(404)
          .json({
            when: "Users > DeleteUser",
            error: result.error,
            error_message: result.error_message,
          });
      }
    })
    .catch((error) => {
      response
        .status(500)
        .json({
          when: "Users > DeleteUser",
          error: 1,
          error_message: error.message,
        });
    });
});

router.patch("/:id", (request, response) => {
  restoreUser(request)
    .then((result) => {
      if (!result.error) {
        response
          .status(200)
          .json({ when: "Users > RestoreUser", result, error: 0 });
      } else {
        response
          .status(400)
          .json({
            when: "Users > RestoreUser",
            error: result.error,
            error_message: result.error_message,
          });
      }
    })
    .catch((error) => {
      response
        .status(500)
        .json({
          when: "Users > RestoreUser",
          error: 1,
          error_message: error.message,
        });
    });
});

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email", "public_profile"] })
);

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
    return res.redirect(
      "http://localhost:5000/settings?error=Vous devez être connecté."
    );
  }

  jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.redirect(
        "http://localhost:5000/settings?error=Token invalide."
      );
    }

    // Stockage du user en session afin de pouvoir comparer dans la strategy si le compte est déjà lié ou pas
    req.session.linkUser = user;
    req.session.save((err) => {
      if (err) {
        console.error("Erreur lors de la sauvegarde de session :", err);
        return res.redirect(
          "http://localhost:5000/settings?error=Erreur serveur."
        );
      }

      passport.authenticate("facebook-link", {
        scope: ["email", "public_profile"],
      })(req, res, next);
    });
  });
});

router.get(
  "/auth/facebook/link/callback",
  passport.authenticate("facebook-link", {
    session: false,
    failureRedirect:
      "http://localhost:5000/settings?error=Erreur Facebook OAuth",
  }),
  (req, res) => {
    res.redirect(
      "http://localhost:5000/settings?success=Compte Facebook lié avec succès."
    );
  }
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

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
    return res.redirect(
      "http://localhost:5000/settings?error=Vous devez être connecté."
    );
  }

  jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.redirect(
        "http://localhost:5000/settings?error=Token invalide."
      );
    }

    req.session.linkUser = user;
    req.session.save((err) => {
      if (err) {
        console.error("Erreur lors de la sauvegarde de session :", err);
        return res.redirect(
          "http://localhost:5000/settings?error=Erreur serveur."
        );
      }

      passport.authenticate("google-link", { scope: ["profile", "email"] })(
        req,
        res,
        next
      );
    });
  });
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
    res.redirect(
      `http://localhost:5000/settings?success=Compte Google lié avec succès&token=${token}`
    );
  }
);

router.get("/:id/providers", getUserProviders);

router.post("/unlink-provider", unlinkProvider);

export default router;
