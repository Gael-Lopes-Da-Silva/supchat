import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "../database/db.js";
import jwt from "jsonwebtoken";

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/users/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const username = profile.displayName || `google_${googleId}`;
        const photo = profile.photos?.[0]?.value;

        if (!googleId || !email) {
          return done(new Error("Impossible de récupérer les informations utilisateur Google."));
        }

        const connection = await pool.getConnection();
        try {
          await connection.beginTransaction();

          const existingUser = await connection.query(
            `SELECT users.* FROM users
             JOIN providers ON users.id = providers.user_id
             WHERE providers.provider_id = ? AND providers.provider = 'google'`,
            [googleId]
          );

          let user;
          if (existingUser.length > 0) {
            user = existingUser[0];
          } else {
            const existingEmailUser = await connection.query(
              "SELECT * FROM users WHERE email = ?",
              [email]
            );

            if (existingEmailUser.length > 0) {
              user = existingEmailUser[0];
              await connection.query(
                "INSERT INTO providers (user_id, provider_id, provider) VALUES (?, ?, 'google')",
                [user.id, googleId]
              );
            } else {
              const insertUserResult = await connection.query(
                "INSERT INTO users (username, email) VALUES (?, ?)",
                [username, email]
              );

              const userId = insertUserResult.insertId;

              await connection.query(
                "INSERT INTO providers (user_id, provider_id, provider) VALUES (?, ?, 'google')",
                [userId, googleId]
              );

              const userResult = await connection.query("SELECT * FROM users WHERE id = ?", [userId]);

              if (userResult.length === 0) {
                return done(new Error("Utilisateur introuvable après insertion.."));
              }

              user = userResult[0];
            }
          }

          await connection.commit();

          const token = jwt.sign(
            {
              id: user.id,
              email: user.email,
              provider: "google",
              username: user.username,
              googleUsername: username,
              googlePhoto: photo,
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
        console.error("Erreur lors de l'authentification Google :", error);
        return done(error);
      }
    }
  )
);

passport.use("google-link", new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/users/auth/google/link/callback",
    passReqToCallback: true,
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      if (!profile?.id || !profile?.emails?.length) {
        return done(new Error("Données Google invalides."));
      }

      const token = req.query.state; // oAuth galère avec les params dans l'url mais lit bien state de query
      if (!token) return done(new Error("Token JWT manquant."));

      let localUser;
      try {
        localUser = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return done(new Error("Token JWT invalide."));
      }

      const userId = localUser.id;
      const googleId = profile.id;
      const email = profile.emails[0].value;

      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        const existingGoogleAccount = await connection.query(
          "SELECT user_id FROM providers WHERE provider_id = ? AND provider = 'google'",
          [googleId]
        );

        if (existingGoogleAccount.length > 0) {
          const linkedUserId = existingGoogleAccount[0].user_id;

          const linkedLocalAccount = await connection.query(
            "SELECT user_id FROM providers WHERE user_id = ? AND provider IS NULL",
            [linkedUserId]
          );

          if (linkedLocalAccount.length > 0 && linkedUserId !== userId) {
            await connection.rollback();
            return req.res.redirect("http://localhost:5000/settings?error=Ce compte Google est déjà lié à un autre compte local.");
          }
        }

        const existingEntry = await connection.query(
          "SELECT * FROM providers WHERE provider_id = ? AND provider = 'google'",
          [googleId]
        );

        if (existingEntry.length > 0) {
          const updateResult = await connection.query(
            `UPDATE providers 
             SET original_user_id = user_id, user_id = ? 
             WHERE provider_id = ? AND provider = 'google'`,
            [userId, googleId]
          );

          if (updateResult.affectedRows === 0) {
            await connection.rollback();
            return req.res.redirect("http://localhost:5000/settings?error=Erreur lors de la fusion des comptes.");
          }
        } else {
          await connection.query(
            "INSERT INTO providers (user_id, provider_id, provider) VALUES (?, ?, 'google')",
            [userId, googleId]
          );
        }

        await connection.commit();
        return done(null, { id: userId, username: localUser.username, email, provider: "google" });
      } catch (error) {
        await connection.rollback();
        console.error("Erreur lors de la liaison du compte Google :", error);
        return done(error);
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Erreur dans google-link :", error);
      return done(error);
    }
  }
));


export default passport;
