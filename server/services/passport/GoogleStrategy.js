import passport from "passport";

import pool from "../../database/db.js";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/users/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log("Access Token:", accessToken);
        console.log("Profile:", profile);

        const googleId = profile.id;
        const email = profile.emails[0]?.value;
        const username = profile.displayName || `google_${googleId}`;

        if (!googleId || !email) {
            throw new Error("Impossible de récupérer les informations utilisateur Google.");
        }

        const connection = await pool.getConnection();
        try {
            const existingGoogleUser = await connection.query(
                "SELECT * FROM users WHERE provider_id = ? AND provider = 'google'",
                [googleId]
            );

            if (existingGoogleUser.length > 0) {
                console.log("Utilisateur Google existant :", existingGoogleUser[0]);
                return done(null, existingGoogleUser[0]);
            }

            const existingUserWithEmail = await connection.query(
                "SELECT * FROM users WHERE email = ? AND provider != 'google'",
                [email]
            );

            if (existingUserWithEmail.length > 0) {
                console.log(
                    "Un utilisateur existe avec cet email mais un autre provider :",
                    existingUserWithEmail[0]
                );
            }

            const result = await connection.query(
                "INSERT INTO users (username, email, provider_id, provider, status_id) VALUES (?, ?, ?, ?, ?)",
                [username, email, googleId, "google", 1]
            );

            const newUser = {
                id: result.insertId,
                username,
                email,
                provider_id: googleId,
                provider: "google",
            };

            console.log("Nouvel utilisateur Google créé :", newUser);
            return done(null, newUser);
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Erreur dans GoogleStrategy :", error.message);
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const connection = await pool.getConnection();
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
