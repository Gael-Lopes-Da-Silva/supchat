import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendConfirmationEmail = (to, token) => {
    const confirmationLink = `http://localhost:3000/users/confirm?token=${token}`;

    const mailOptions = {
        from: `"Supchat" <${process.env.SMTP_USER}>`,
        to,
        subject: 'Confirmation de création de compte - Supchat',
        html: `
        <h1>Bienvenue sur Supchat !</h1>
        <p>Veuillez confirmer votre adresse email en cliquant sur le lien ci-dessous :</p>
        <a href="${confirmationLink}">Confirmer mon compte</a>
        <p>Si vous n'avez pas demandé cette inscription, ignorez cet email.</p>
      `,
    };

    return transporter.sendMail(mailOptions);
};
