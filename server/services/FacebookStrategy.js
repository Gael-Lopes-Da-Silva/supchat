import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import pool from "../database/db.js";
import jwt from "jsonwebtoken";
import jsonwebtoken from "jsonwebtoken";

passport.use(
  "facebook",
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/users/auth/facebook/callback",
      profileFields: ["id", "emails", "name", "displayName", "picture.type(large)"]
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const facebookId = profile.id;
        const email = profile.emails?.[0]?.value || null;
        const fullName = profile.displayName || `facebook_${profile.id}`;
        const username = fullName.split(" ")[0];
        const photo = profile.photos?.[0]?.value || null;

        if (!facebookId) {
          return done(new Error("Impossible de récupérer les informations utilisateur Facebook."));
        }

        const connection = await pool.getConnection();
        try {
          await connection.beginTransaction();

          const existingUser = await connection.query(
            `SELECT users.* FROM users 
             JOIN providers ON users.id = providers.user_id 
             WHERE providers.provider_id = ? AND providers.provider = 'facebook'`,
            [facebookId]
          );

          let user;
          if (existingUser.length > 0) {
            user = existingUser[0];
          } else {
            const insertUserResult = await connection.query(
              "INSERT INTO users (username, email) VALUES (?, ?)",
              [username, email]
            );

            const userId = insertUserResult.insertId;

            await connection.query(
              "INSERT INTO providers (user_id, provider_id, provider) VALUES (?, ?, 'facebook')",
              [userId, facebookId]
            );

            const userResult = await connection.query("SELECT * FROM users WHERE id = ?", [userId]);

            if (userResult.length === 0) {
              return done(new Error("Utilisateur introuvable après insertion..."));
            }

            user = userResult[0];
          }

          await connection.commit();

          const token = jwt.sign(
            {
              id: user.id,
              email: user.email,
              provider: "facebook",
              username: user.username,
              facebookPhoto: photo
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );

          user.token = token;
          return done(null, user);
        } finally {
          connection.release();
        }
      } catch (error) {
        console.error("Erreur authentification Facebook :", error);
        return done(error);
      }
    }
  )
);

passport.use("facebook-link", new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/users/auth/facebook/link/callback",
    passReqToCallback: true,
    profileFields: ["id", "emails", "name", "displayName", "picture.type(large)"]
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      if (!profile?.id || !profile?.emails?.length) {
        return done(new Error("Données Facebook invalides."));
      }

      const token = req.query.token;
      if (!token) {
        return done(new Error("Token manquant dans la requête."));
      }

      let localUser;
      try {
        localUser = jsonwebtoken.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return done(new Error("Token JWT invalide."));
      }

      const userId = localUser.id;
      const facebookId = profile.id;
      const email = profile.emails[0].value;

      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        const existingFacebookAccount = await connection.query(
          "SELECT user_id FROM providers WHERE provider_id = ? AND provider = 'facebook'",
          [facebookId]
        );

        if (existingFacebookAccount.length > 0) {
          const linkedUserId = existingFacebookAccount[0].user_id;

          const linkedLocalAccount = await connection.query(
            "SELECT user_id FROM providers WHERE user_id = ? AND provider IS NULL",
            [linkedUserId]
          );

          if (linkedLocalAccount.length > 0 && linkedUserId !== userId) {
            await connection.rollback();
            return req.res.redirect(`http://localhost:5000/settings?error=Ce compte Facebook est déjà lié à un autre compte local.`);
          }
        }

        const existingEntry = await connection.query(
          "SELECT * FROM providers WHERE provider_id = ? AND provider = 'facebook'",
          [facebookId]
        );

        if (existingEntry.length > 0) {
          const updateResult = await connection.query(
            "UPDATE providers SET user_id = ? WHERE provider_id = ? AND provider = 'facebook'",
            [userId, facebookId]
          );

          if (updateResult.affectedRows === 0) {
            await connection.rollback();
            return req.res.redirect(`http://localhost:5000/settings?error=Erreur lors de la fusion des comptes.`);
          }
        } else {
          await connection.query(
            "INSERT INTO providers (user_id, provider_id, provider) VALUES (?, ?, 'facebook')",
            [userId, facebookId]
          );
        }

        await connection.commit();
        return done(null, { id: userId, username: localUser.username, email, provider: "facebook" });

      } catch (error) {
        await connection.rollback();
        console.error("Erreur lors de la liaison du compte Facebook :", error);
        return done(error);
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Erreur dans facebook-link :", error);
      return done(error);
    }
  }
));

export default passport;
