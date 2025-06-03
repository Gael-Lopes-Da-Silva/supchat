import pool from "../database/db.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_MOBILE_CLIENT_ID);

export const verifyGoogleToken = async (token) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_MOBILE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return {
      googleId: payload.sub,
      email: payload.email,
      username: payload.name || `google_${payload.sub}`,
      photo: payload.picture,
    };
  } catch (error) {
    throw new Error("Token Google invalide");
  }
};

export const verifyFacebookToken = async (token) => {
  try {
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`
    );
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    return {
      facebookId: data.id,
      email: data.email,
      username: data.name.split(" ")[0] || `facebook_${data.id}`,
      photo: data.picture?.data?.url,
    };
  } catch (error) {
    throw new Error("Token Facebook invalide");
  }
};

export const handleGoogleAuth = async (profile) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const existingUser = await connection.query(
      `SELECT users.* FROM users
       JOIN providers ON users.id = providers.user_id
       WHERE providers.provider_id = ? AND providers.provider = 'google'`,
      [profile.googleId]
    );

    let user;
    if (existingUser.length > 0) {
      user = existingUser[0];
    } else {
      const existingEmailUser = await connection.query(
        "SELECT * FROM users WHERE email = ?",
        [profile.email]
      );

      if (existingEmailUser.length > 0) {
        user = existingEmailUser[0];
        await connection.query(
          "INSERT INTO providers (user_id, provider_id, provider) VALUES (?, ?, 'google')",
          [user.id, profile.googleId]
        );
      } else {
        const insertUserResult = await connection.query(
          "INSERT INTO users (username, email) VALUES (?, ?)",
          [profile.username, profile.email]
        );

        const userId = insertUserResult.insertId;

        await connection.query(
          "INSERT INTO providers (user_id, provider_id, provider) VALUES (?, ?, 'google')",
          [userId, profile.googleId]
        );

        const userResult = await connection.query(
          "SELECT * FROM users WHERE id = ?",
          [userId]
        );

        if (userResult.length === 0) {
          throw new Error("Utilisateur introuvable après insertion.");
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
        googleUsername: profile.username,
        googlePhoto: profile.photo,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { user, token };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const handleFacebookAuth = async (profile) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const existingUser = await connection.query(
      `SELECT users.* FROM users
       JOIN providers ON users.id = providers.user_id
       WHERE providers.provider_id = ? AND providers.provider = 'facebook'`,
      [profile.facebookId]
    );

    let user;
    if (existingUser.length > 0) {
      user = existingUser[0];
    } else {
      const insertUserResult = await connection.query(
        "INSERT INTO users (username, email) VALUES (?, ?)",
        [profile.username, profile.email]
      );

      const userId = insertUserResult.insertId;

      await connection.query(
        "INSERT INTO providers (user_id, provider_id, provider) VALUES (?, ?, 'facebook')",
        [userId, profile.facebookId]
      );

      const userResult = await connection.query(
        "SELECT * FROM users WHERE id = ?",
        [userId]
      );

      if (userResult.length === 0) {
        throw new Error("Utilisateur introuvable après insertion.");
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
        facebookPhoto: profile.photo,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { user, token };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}; 