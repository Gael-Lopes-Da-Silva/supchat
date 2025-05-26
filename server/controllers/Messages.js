import pool from "../database/db.js";
import { readUser } from "./Users.js";
import { readChannel } from "./Channels.js";
import { readWorkspace } from "./Workspaces.js";

export const createAndPrepareMessage = async ({ user_id, content, channel_id, attachment }) => {
    if (!user_id || (!content && !attachment) || !channel_id) {
        throw new Error("Champs manquants.");
    }

    const result = await pool.query(
        "INSERT INTO messages (channel_id, user_id, content) VALUES (?, ?, ?)",
        [channel_id, user_id, content]
    );

    const message_id = result.insertId;

    if (attachment) {
        await pool.query(
            "INSERT INTO files (message_id, file_path) VALUES (?, ?)",
            [message_id, attachment]
        );
    }

    const user = await readUser({ params: { id: user_id } });
    const channel = await readChannel({ params: { id: channel_id } });
    const workspace = await readWorkspace({ params: { id: channel.workspace_id } });

    const allUsers = await pool.query("SELECT id, username FROM users");
    const usernameMap = new Map(allUsers.map(u => [u.username.toLowerCase(), u.id]));

    const mentionedUsernames = content
        .split(/\s+/)
        .filter(word => word.startsWith("@"))
        .map(word => word.slice(1).toLowerCase())
        .filter(username => usernameMap.has(username));

    const mentionedUserIds = mentionedUsernames.map(username => usernameMap.get(username));

    return {
        id: message_id,
        username: user.username,
        content,
        attachment,
        channel_id,
        channel_name: channel.name,
        workspace_id: channel.workspace_id,
        workspace_name: workspace.name,
        user_id,
        mentioned_user_ids: mentionedUserIds,
    };
};
