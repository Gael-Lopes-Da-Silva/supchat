import passport from "passport";

import pool from "../../database/db.js";

import { Strategy as FacebookStrategy } from "passport-facebook";

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/users/auth/facebook/callback",
    profileFields: ["id", "displayName", "photos", "email"],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log("Access Token:", accessToken);
        console.log("Profile:", profile);

        const facebookId = profile.id;
        const email = profile.emails ? profile.emails[0].value : null;
        const username = profile.displayName || `facebook_${facebookId}`;

        if (!facebookId || !email) {
            throw new Error(
                "Impossible de récupérer les informations utilisateur Facebook."
            );
        }

        const connection = await pool.getConnection();
        try {
            const rows = await connection.query(
                "SELECT * FROM users WHERE provider_id = ? AND provider = ?",
                [facebookId, "facebook"]
            );

            if (rows.length > 0) {
                console.log("Utilisateur existant (Facebook) :", rows[0]);
                return done(null, rows[0]);
            }

            console.log("Création d'un nouvel utilisateur (Facebook)...");

            const result = await connection.query(
                "INSERT INTO users (username, email, provider_id, provider) VALUES (?, ?, ?, ?)",
                [username, email, facebookId, "facebook"]
            );

            const newUser = {
                id: result.insertId,
                username,
                email,
                provider_id: facebookId,
                provider: "facebook",
            };

            console.log("Nouvel utilisateur créé :", newUser);
            return done(null, newUser);
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Erreur dans FacebookStrategy :", error.message);
        return done(error);
    }
}));

export default passport;
