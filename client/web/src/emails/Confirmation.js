export const subject = () => "[Supchat] Confirmation de votre compte";
export const body = (confirm_token) => `http://localhost:5000/register?confirm_token=${confirm_token}`;