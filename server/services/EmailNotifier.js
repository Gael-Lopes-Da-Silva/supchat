import { sendEmail } from './EmailHandler.js'; 
import pool from "../database/db.js";



export const notifyUsersByEmail = async ({ io, channel_id, sender_id, message }) => {
    try {

            console.log('notifyUsersByEmail appelé', { channel_id, sender_id });

        // recup tous les users connectés
        const sockets = await io.fetchSockets();
        const connectedUserIds = sockets.map(s => s.userId).filter(Boolean); 

         // puis les users du channel id
        const members = await pool.query(
            `SELECT u.email, u.username, u.id 
             FROM channel_members cm
             JOIN users u ON cm.user_id = u.id
             WHERE cm.channel_id = ? AND cm.deleted_at IS NULL`,
            [channel_id]
        );


   for (const member of members) {
    const isConnected = connectedUserIds.includes(member.id);

    if (member.id === sender_id || isConnected) continue;

    const htmlContent = `
        <h3>💬 Nouveau message dans  le canal <strong> #${message.channel_name}</strong>  du workspace <strong>${message.workspace_name}</strong></h3>
        <p><strong>${message.username} :</strong> ${message.content}</p>
        <hr />
        <p><a href="https://localhost:5000">Connecte-toi à Supchat</a> pour voir la suite.</p>
    `;

    await sendEmail({
        body: {
            to: member.email,
            subject: `📨 Nouveau message dans #${message.channel_name}`,
            content: htmlContent
        }
    });

}

    } catch (error) {
        console.error("Erreur dans EmailNotifier:", error);
    }
};
