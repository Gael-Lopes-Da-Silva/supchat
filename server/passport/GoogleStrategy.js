import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import db from "../database/db.js";
import dotenv from "dotenv";

dotenv.config();


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,  // VEUILLEZ ME MP SUR DISCORD OU TEAMS POUR LE .ENV (zak)
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
      callbackURL: "http://localhost:3000/users/auth/google/callback", 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Access Token:", accessToken);
        console.log("Profile:", profile);

        const googleId = profile.id; 
        const email = profile.emails[0]?.value; 
        const username = profile.displayName || `google_${googleId}`; 

        if (!googleId || !email) {
          throw new Error("Impossible de récupérer les informations utilisateur Google.");
        }

        
        const connection = await db.getConnection();
        try {
          
          const rows = await connection.query(
            "SELECT * FROM users WHERE provider_id = ?",
            [googleId]
          );

          if (rows.length > 0) {
            console.log("Utilisateur existant :", rows[0]);
            return done(null, rows[0]); 
          } else {
            console.log("Création d'un nouvel utilisateur...");

            
            const result = await connection.query(
              "INSERT INTO users (username, email, provider_id, provider, status_id) VALUES (?, ?, ?, ?, ?)",
              [username, email, googleId, "google", 2]
            );
            
            const newUser = {
              id: result.insertId,
              username,
              email,
              provider_id: googleId,
            };

            console.log("Nouvel utilisateur créé :", newUser);
            return done(null, newUser); 
          }
        } finally {
          connection.release(); 
        }
      } catch (error) {
        console.error("Erreur dans GoogleStrategy :", error.message);
        return done(error); 
      }
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user.id); 
});


passport.deserializeUser(async (id, done) => {
  try {
    const connection = await db.getConnection();
    const rows = await connection.query("SELECT * FROM users WHERE id = ?", [id]);

    if (rows.length > 0) {
      done(null, rows[0]); 
    } else {
      done(null, null);
    }
  } catch (error) {
    done(error);
  }
});

export default passport;
