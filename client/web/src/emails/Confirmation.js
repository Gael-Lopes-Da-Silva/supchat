export const subject = () => "[Supchat] Confirmation de votre compte";
export const content = (confirm_token) => `
<p>Bonjour 👋,</p>

<p>Bienvenue sur <strong>Supchat</strong> ! 🎉 Nous sommes ravis de vous voir parmi nous.</p>

<p>Pour activer votre compte et commencer à discuter, cliquez sur le bouton ci-dessous :</p>

<a href="${process.env.REACT_APP_BASE_URL}accountConfirmed?confirm_token=${confirm_token}&api_url=${process.env.REACT_APP_API_URL}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #fff; text-decoration: none; font-weight: bold; border-radius: 5px;">
    Activer mon compte
</a>

<p>Si vous n’êtes pas à l’origine de cette inscription, pas de souci ! Vous pouvez simplement ignorer cet e-mail. 🚀</p>

<p>À bientôt sur Supchat ! 🚀</p>
<p>— L’équipe Supchat</p>
`;