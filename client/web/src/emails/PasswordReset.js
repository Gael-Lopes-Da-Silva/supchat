export const subject = () => "[Supchat] Réinitialisation de votre mot de passe";
export const content = (password_reset_token) => `
<p>Bonjour,</p>

<p>Vous avez fait une demande de réinitialisation de votre mot de passe <strong>Supchat</strong> !</p>
<p>Vous pouvez des maintenant modifier ce dernier en cliquant sur le bouton ci-dessous :</p>

<a href="http://localhost:5000/reset_password?password_reset_token=${password_reset_token}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #fff; text-decoration: none; font-weight: bold; border-radius: 5px;">
    Modifier mon mot de passe
</a>

<p>Si vous n'êtes pas à l'origine de cette démarche, ignorez simplement cet e-mail.</p>

<p>Cordialement,</p>
<p><strong>L'équipe Supchat</strong></p>
`;