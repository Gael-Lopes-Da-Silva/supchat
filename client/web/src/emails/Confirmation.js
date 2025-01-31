export const subject = () => "[Supchat] Confirmation de votre compte";
export const content = (confirm_token) => `
<p>Bonjour,</p>

<p>Merci de vous être inscrit sur <strong>Supchat</strong> !</p>
<p>Veuillez confirmer votre adresse e-mail en cliquant sur le bouton ci-dessous :</p>

<a href="${process.env.REACT_APP_BASE_URL}register?confirm_token=${confirm_token}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #fff; text-decoration: none; font-weight: bold; border-radius: 5px;">
    Confirmer mon compte
</a>

<p>Si vous n'avez pas créé de compte, ignorez simplement cet e-mail.</p>

<p>Cordialement,</p>
<p><strong>L'équipe Supchat</strong></p>
`;