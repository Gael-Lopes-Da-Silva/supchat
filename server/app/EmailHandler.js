import nodemailer from 'nodemailer';

export const sendEmail = (request) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });
    
    return transporter.sendMail({
        from: `"Supchat" <${process.env.SMTP_USER}>`,
        to: request.body.to,
        subject: request.body.subject,
        html: request.body.content,
    });
};
