export const subject = () => "[Supchat] Réinitialisation de votre mot de passe";
export const content = (password_reset_token) => `
<p>Bonjour 👋,</p>

<p>Vous avez demandé une réinitialisation de votre mot de passe <strong>Supchat</strong>. Pas de panique, on s’occupe de tout ! 🔒</p>

<p>Il vous suffit de cliquer sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>

<a href="${process.env.REACT_APP_BASE_URL}reset_password?password_reset_token=${password_reset_token}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #fff; text-decoration: none; font-weight: bold; border-radius: 5px;">
    Modifier mon mot de passe
</a>

<p>Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité. 👍</p>

<p>À bientôt sur Supchat ! 🚀</p>
<p>— L’équipe Supchat</p>
`;