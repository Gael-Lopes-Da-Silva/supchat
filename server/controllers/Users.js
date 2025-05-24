import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import PDFDocument from "pdfkit";

import pool from "../database/db.js";
import { ERRORS, createErrorResponse } from "../services/ErrorHandler.js";

export const createUser = async (request) => {
  const existing = await pool.query(
    "SELECT u.id, p.provider FROM users u LEFT JOIN providers p ON u.id = p.user_id WHERE u.email = ?",
    [request.body.email]
  );

  const alreadyLocal = existing.some(
    (row) => row.provider === "local" || row.provider === null
  );

  if (alreadyLocal) {
    return createErrorResponse(ERRORS.EMAIL_ALREADY_USED);
  }

  const hashedPassword = bcrypt.hashSync(request.body.password, 10);
  const confirmToken = crypto.randomBytes(32).toString("hex");

  const userInsertResult = await pool.query(
    "INSERT INTO users (username, email, password, confirm_token, created_at) VALUES (?, ?, ?, ?, NOW())",
    [request.body.username, request.body.email, hashedPassword, confirmToken]
  );

  if (userInsertResult.affectedRows === 0) {
    return createErrorResponse(ERRORS.INTERNAL_SERVER_ERROR);
  }

  const userId = userInsertResult.insertId;

  await pool.query(
    "INSERT INTO providers (user_id, provider) VALUES (?, NULL)",
    [userId]
  );

  return {
    success: true,
    message: "Utilisateur créé avec succès",
    user: {
      id: userId,
      username: request.body.username,
      email: request.body.email,
      confirm_token: confirmToken,
      created_at: new Date().toISOString(),
    },
  };
};

export const readUser = async (request) => {
  if (request.params.id) {
    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
      request.params.id,
    ]);

    if (!user) {
      return createErrorResponse(ERRORS.USER_NOT_FOUND);
    }

    return user;
  }

  let query = "SELECT * FROM users";
  let where = [];
  let params = [];

  if (request.query.username) {
    where.push("username = ?");
    params.push(request.query.username);
  }
  if (request.query.email) {
    where.push("email = ?");
    params.push(request.query.email);
  }
  if (request.query.confirm_token) {
    where.push("confirm_token = ?");
    params.push(request.query.confirm_token);
  }
  if (request.query.password_reset_token) {
    where.push("password_reset_token = ?");
    params.push(request.query.password_reset_token);
  }
  if (request.query.provider) {
    where.push("provider = ?");
    params.push(request.query.provider);
  }

  if (where.length > 0) {
    query += " WHERE " + where.join(" AND ");
  }

  const users = await pool.query(query, params);

  if (!users || users.length === 0) {
    return createErrorResponse(ERRORS.USER_NOT_FOUND);
  }

  return pool.query(query, params);
};

export const readUsersByIds = async (ids = []) => {
  // pour afficher tous les users connecvtés

  // etant donné que c'est une requête préparer qu'on va faire, il faut afficher autant de "?" que d'id (membres connectés)
  //donc on map sur ids et on sépare par des virgules.
  const placeholders = ids.map(() => "?").join(",");
  const query = `SELECT id, username FROM users WHERE id IN (${placeholders})`;

  const result = await pool.query(query, ids);

  return {
    success: true,
    result,
  };
};

export const updateUser = async (request) => {
  if (!request.params.id) {
    return createErrorResponse(ERRORS.DATA_MISSING, "ID not provided");
  }

  const updateResult = await pool.query(
    "UPDATE users SET confirm_token = NULL, updated_at = NOW() WHERE id = ?",
    [request.params.id]
  );

  if (updateResult.affectedRows === 0) {
    console.error("Erreur : Aucun utilisateur mis à jour !");
    return createErrorResponse(ERRORS.INTERNAL_SERVER_ERROR);
  }

  return { success: true, message: "Utilisateur mis à jour avec succès" };
};

export const deleteUser = async (request) => {
  if (!request.params.id)
    return createErrorResponse(ERRORS.DATA_MISSING, "ID not provided");

  const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
    request.params.id,
  ]);
  if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
  if (user.deleted_at !== null)
    return createErrorResponse(ERRORS.USER_ALREADY_DELETED);

  return pool.query("UPDATE users SET deleted_at = NOW() WHERE id = ?", [
    request.params.id,
  ]);
};

export const restoreUser = async (request) => {
  if (!request.params.id)
    return createErrorResponse(ERRORS.DATA_MISSING, "ID not provided");

  const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
    request.params.id,
  ]);
  if (!user) return createErrorResponse(ERRORS.USER_NOT_FOUND);
  if (user.deleted_at === null)
    return createErrorResponse(ERRORS.USER_NOT_DELETED);

  return pool.query("UPDATE users SET deleted_at = NULL WHERE id = ?", [
    request.params.id,
  ]);
};

export const loginUser = async (request) => {
  const [users] = await pool.query(
    "SELECT u.*, p.provider FROM users u LEFT JOIN providers p ON u.id = p.user_id WHERE u.email = ? AND (p.provider = 'local' OR p.provider IS NULL)",
    [request.body.email]
  );

  console.log("Users found:", users);
  if (!users || users.length === 0) {
    console.error(
      "Aucun utilisateur trouvé pour cet email :",
      request.body.email
    );
    return createErrorResponse(
      ERRORS.USER_NOT_FOUND,
      "Aucun utilisateur trouvé avec cet e-mail."
    );
  }

  const user = users;
  console.log("User  token:", user.confirm_token);
  if (user.confirm_token !== null) {
    console.error("Compte non confirmé :", user.email);
    return createErrorResponse(
      ERRORS.USER_NOT_CONFIRMED,
      "Veuillez confirmer votre compte avant de vous connecter."
    );
  }

  const match = await bcrypt.compare(request.body.password, user.password);
  if (!match) {
    console.error("Mot de passe incorrect !");
    return createErrorResponse(
      ERRORS.WRONG_PASSWORD,
      "Mot de passe incorrect."
    );
  }

  if (user.provider === "google") {
    return createErrorResponse(
      ERRORS.USE_GOOGLE_LOGIN,
      "Veuillez vous connecter avec Google."
    );
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      provider: user.provider,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    success: true,
    token: token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      provider: user.provider,
      created_at: user.created_at,
    },
  };
};

export const getUserProviders = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json(
        createErrorResponse(ERRORS.DATA_MISSING, "ID utilisateur manquant.")
      );
  }

  try {
    const connection = await pool.getConnection();

    const providers = await connection.query(
      "SELECT provider FROM providers WHERE user_id = ?",
      [id]
    );

    const localAccountExists = await connection.query(
      "SELECT COUNT(*) AS count FROM providers WHERE user_id = ? AND provider IS NULL",
      [id]
    );

    const googleAccountExists = await connection.query(
      "SELECT COUNT(*) AS count FROM providers WHERE user_id = ? AND provider = 'google'",
      [id]
    );

    const facebookAccountExists = await connection.query(
      "SELECT COUNT(*) AS count FROM providers WHERE user_id = ? AND provider = 'facebook'",
      [id]
    );

    connection.release();

    const isGoogleLinked =
      localAccountExists[0].count > 0 && googleAccountExists[0].count > 0;
    const isFacebookLinked =
      localAccountExists[0].count > 0 && facebookAccountExists[0].count > 0;

    res.json({
      result: providers.map((p) => p.provider).filter((p) => p !== null),
      isGoogleLinked,
      isFacebookLinked,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des providers :", error);
    res.status(500).json(createErrorResponse(ERRORS.INTERNAL_SERVER_ERROR));
  }
};

export const unlinkProvider = async (req, res) => {
  const { user_id, provider } = req.body;

  if (!user_id || !provider) {
    return res
      .status(400)
      .json(createErrorResponse(ERRORS.DATA_MISSING, "Données manquantes."));
  }

  try {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const existingProvider = await connection.query(
        "SELECT * FROM providers WHERE user_id = ? AND provider = ?",
        [user_id, provider]
      );

      if (existingProvider.length === 0) {
        await connection.rollback();
        return res
          .status(404)
          .json(createErrorResponse(ERRORS.SOCIAL_ACCOUNT_NOT_FOUND));
      }

      const result = await connection.query(
        "DELETE FROM providers WHERE user_id = ? AND provider = ?",
        [user_id, provider]
      );

      if (result.affectedRows > 0) {
        await connection.commit();
        return res.json({
          success: true,
          message: `Compte ${provider} délié.`,
        });
      } else {
        await connection.rollback();
        return res
          .status(500)
          .json(createErrorResponse(ERRORS.OPERATION_FAILED));
      }
    } catch (error) {
      await connection.rollback();
      console.error("Erreur lors de la suppression du provider :", error);
      return res
        .status(500)
        .json(createErrorResponse(ERRORS.INTERNAL_SERVER_ERROR));
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(" Erreur générale :", error);
    return res
      .status(500)
      .json(createErrorResponse(ERRORS.INTERNAL_SERVER_ERROR));
  }
};

export const exportUserData = async (req, res) => {
  const userId = req.params.id;

  try {
    const users = await pool.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);
    const user = users[0];
    if (!user)
      return res.status(404).json(createErrorResponse(ERRORS.USER_NOT_FOUND));

    const providers = await pool.query(
      "SELECT * FROM providers WHERE user_id = ?",
      [userId]
    );
    const workspaces = await pool.query(
      "SELECT * FROM workspaces WHERE user_id = ?",
      [userId]
    );
    const workspaceMemberships = await pool.query(
      `
            SELECT wm.*, w.name AS workspace_name
            FROM workspace_members wm
            JOIN workspaces w ON wm.workspace_id = w.id
            WHERE wm.user_id = ?
            `,
      [userId]
    );

    const channelMemberships = await pool.query(
      `
            SELECT cm.*, c.name AS channel_name
            FROM channel_members cm
            JOIN channels c ON cm.channel_id = c.id
            WHERE cm.user_id = ?
            `,
      [userId]
    );

    const messages = await pool.query(
      "SELECT * FROM messages WHERE user_id = ?",
      [userId]
    );
    const reactions = await pool.query(
      `SELECT r.*, m.content AS message_content
                FROM reactions r
                LEFT JOIN messages m ON r.message_id = m.id
                WHERE r.user_id = ?`,
      [userId]
    );

    // Configuration PDF
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="mes_donnees_supchat.pdf"'
    );
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    // Titre principal
    doc
      .fontSize(20)
      .text(" Export de vos données Supchat", {
        align: "center",
        underline: true,
      });
    doc.moveDown(1.5);

    // Informations utilisateur
    doc.fontSize(14).text(` Nom d'utilisateur : ${user.username}`);
    doc.text(` Email : ${user.email}`);
    doc.text(` ID utilisateur : ${user.id}`);
    doc.text(` Créé le : ${new Date(user.created_at).toLocaleString("fr-FR")}`);
    doc.moveDown();

    // Providers
    doc.fontSize(16).text("Nature du compte :", { underline: true });
    providers.forEach((p) => doc.text(`- ${p.provider || "local"}`));
    doc.moveDown();

    // Workspaces
    doc.fontSize(16).text(" Espaces de travail créés :", { underline: true });
    if (workspaces.length === 0) doc.text("Aucun.");
    workspaces.forEach((ws) =>
      doc.text(`- ${ws.name} (${ws.is_private ? "Privé" : "Public"})`)
    );
    doc.moveDown();

    // Workspace memberships
    doc
      .fontSize(16)
      .text(" Participations aux workspaces :", { underline: true });
    if (workspaceMemberships.length === 0) doc.text("Aucune.");
    workspaceMemberships.forEach((wm) =>
      doc.text(
        `- ${wm.workspace_name} (ID : ${wm.workspace_id}) | Rôle ID : ${wm.role_id}`
      )
    );
    doc.moveDown();

    // Channel memberships
    doc.fontSize(16).text(" Canaux rejoints :", { underline: true });
    if (channelMemberships.length === 0) doc.text("Aucun.");
    channelMemberships.forEach((cm) =>
      doc.text(
        `- ${cm.channel_name} (ID : ${cm.channel_id}) | Rôle ID : ${cm.role_id}`
      )
    );
    doc.moveDown();

    // Messages
    doc.fontSize(16).text(" Messages envoyés :", { underline: true });
    if (messages.length === 0) doc.text("Aucun.");
    messages
      .slice(0, 20)
      .forEach((m) =>
        doc.text(
          `• ${m.content?.slice(0, 100) || "(fichier)"} — ${new Date(
            m.created_at
          ).toLocaleString("fr-FR")}`
        )
      );
    if (messages.length > 20) doc.text(`...et ${messages.length - 20} autres`);
    doc.moveDown();

    // Réactions

    doc.fontSize(16).text(" Réactions ajoutées :", { underline: true });

    if (reactions.length === 0) {
      doc.text("Aucune.");
    } else {
      reactions.forEach((r) => {
        const emojiName =
          {
            "❤️": "coeur",
            "😂": "rire",
            "👍": "pouce",
            "👎": "pouce bas",
            "🔥": "flamme",
            "😢": "triste",
            "😡": "colère",
          }[r.emoji] || r.emoji;

        const contentPreview = r.message_content
          ? r.message_content.slice(0, 100)
          : "(un fichier)";

        doc.text(
          `- ${emojiName} sur « ${contentPreview} » — ${new Date(
            r.added_at
          ).toLocaleString("fr-FR")}`
        );
      });
    }

    doc.end();
  } catch (err) {
    console.error("Erreur exportUserData PDF :", err);
    res.status(500).json(createErrorResponse(ERRORS.INTERNAL_SERVER_ERROR));
  }
};
