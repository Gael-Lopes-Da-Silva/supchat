import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import pool from "../../database/db.js";
import jwt from "jsonwebtoken";

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
                const username = profile.displayName || `facebook_${facebookId}`;
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
                        console.log("ya dja un user de trouvé :", existingUser[0]);
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

                        // jrecup le nouvel user et j'envoie au front
                        const userResult = await connection.query("SELECT * FROM users WHERE id = ?", [userId]);

                        if (userResult.length === 0) {
                            return done(new Error("Utilisateur introuvable après insertion... chelou non?"));
                        }

                        user = userResult[0];
                        console.log("new uzer :", user);
                    }

                    await connection.commit();

                  
                    const token = jwt.sign(
                        { id: user.id, email: user.email, provider: "facebook", username: user.username, facebookPhoto: photo },
                        process.env.JWT_SECRET,
                        { expiresIn: "1h" }
                    );

                    console.log("🔑 Token JWT généré :", token);
                    return done(null, { user, token });
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
          console.log("✅ Tentative de liaison du compte Facebook :", profile);

          if (!profile?.id || !profile?.emails?.length) {
              return done(new Error("Données facebook non retournées."));
          }

          const localUser = req.session.linkUser;
          if (!localUser || !localUser.id) {
              return done(new Error("Aucun utilisateur local trouvé."));
          }

          const userId = localUser.id;
          const facebookId = profile.id;
          const email = profile.emails[0].value;

          const connection = await pool.getConnection();
          try {
              await connection.beginTransaction();

              //vérif si le compte facebook en question est déjà présent dans la table providers
              const existingFacebookAccount = await connection.query(
                  "SELECT user_id FROM providers WHERE provider_id = ? AND provider = 'facebook'",
                  [facebookId]
              );

              if (existingFacebookAccount.length > 0) {
                  const linkedUserId = existingFacebookAccount[0].user_id;

                  //  Verif si ce compte facebook est lié à un compte local (provider =null )
                  const linkedLocalAccount = await connection.query(
                      "SELECT user_id FROM providers WHERE user_id = ? AND provider IS NULL",
                      [linkedUserId]
                  );

                  if (linkedLocalAccount.length > 0 && linkedUserId !== userId) {
                      console.error(`❌ Ce compte Facebook est déjà lié à un autre compte local (user_id: ${linkedUserId}).`);
                      await connection.rollback();
                      return req.res.redirect(`http://localhost:5000/settings?error=Ce compte Facebook est déjà lié à un autre compte local.`);
                  }
              }

              //  verif  si une entrée existe déjà pour ce provider_id
              const existingEntry = await connection.query(
                  "SELECT * FROM providers WHERE provider_id = ? AND provider = 'facebook'",
                  [facebookId]
              );

              if (existingEntry.length > 0) {
                  //MAJ si l'entrée existe (genre si un compte facebook est déjà creer en bdd mais pas encore lié donc déjà présent dans la table provider)
                  const updateResult = await connection.query(
                      "UPDATE providers SET user_id = ? WHERE provider_id = ? AND provider = 'facebook'",
                      [userId, facebookId]
                  );


                  if (updateResult.affectedRows === 0) {
                      await connection.rollback();
                      return req.res.redirect(`http://localhost:5000/settings?error=Erreur lors de la fusion des comptes.`);
                  }
              } else {
                  // Insert si l'entrée nexiste pas
                  await connection.query(
                      "INSERT INTO providers (user_id, provider_id, provider) VALUES (?, ?, 'facebook')",
                      [userId, facebookId]
                  );
              } 

              await connection.commit();
              console.log("Compte Facebook lié avec succès");
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


passport.serializeUser((user, done) => {  // sert à stocker l'id de l'utilisateur dans la session (cas d'un compte google non lié)
    done(null, user.user.id);
});

passport.deserializeUser(async (id, done) => {//sert à récupérer l'user dasn la session(cas d'un compte google non lié)
    try {
        const connection = await pool.getConnection();
        const userResult = await connection.query("SELECT * FROM users WHERE id = ?", [id]);

        if (userResult.length > 0) {
            done(null, userResult[0]);
        } else {
            done(null, null);
        }
    } catch (error) {
        done(error);
    }
});

export default passport;
