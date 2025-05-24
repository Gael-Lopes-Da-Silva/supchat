import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

import * as PostConfirmationEmail from '../../emails/PostConfirmation';
import { sendEmail } from '../../services/Email';
import { readUser, updateUser } from '../../services/Users';
import Link from "../../components/Link/Link";

import './RegisterPage.css';

const AccountConfirmedPage = () => {
  const [theme] = useState(localStorage.getItem('gui.theme') ?? 'light');
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const confirm_token = query.get('confirm_token');
    const api_url = query.get('api_url');

    if (confirm_token) {
      readUser({ confirm_token }, api_url).then((data) => {
        if (!data || !data.result || data.result.length === 0) {
          toast.error("Utilisateur introuvable", {
            position: "top-center",
          });
          return;
        }

        const user = data.result[0];

        if (!user || !user.id) {
          toast.error("Erreur interne : Impossible de récupérer l'utilisateur.", {
            position: "top-center",
          });
          return;
        }

        console.log("Mise à jour utilisateur", user.id);

        updateUser(user.id, { confirm_token: null }, api_url)
          .then(() => {
            sendEmail({
              to: user.email,
              subject: PostConfirmationEmail.subject(),
              content: PostConfirmationEmail.content(),
            }, api_url).catch(() => {
              toast.error("Une erreur est survenue lors de l'envoi du mail.", {
                position: "top-center",
              });
            });

            toast.success("Votre compte a bien été confirmé. Vous pouvez maintenant vous connecter.", {
              position: "top-center",
            });
          })
          .catch(() => {
            toast.error("Erreur lors de la mise à jour du compte.", {
              position: "top-center",
            });
          });
      }).catch(() => {
        toast.error("Erreur lors de la récupération de l'utilisateur.", {
          position: "top-center",
        });
      });
    }
  }, []);



  return (
    <div className={`privacy-container ${theme}`}>
      <div className="privacy-box">
        <h1>🎉 Votre compte a été activé !</h1>
        <hr />
        <p>Merci d’avoir confirmé votre adresse e-mail.</p>
        <p>Votre compte Supchat est maintenant actif ! Vous pouvez dès à présent vous connecter via le site web {" "}
          <Link text="ici" onClick={() => navigate("/login")} />{" "}
          ou l'application mobile et commencer à discuter 🎊</p>
        <hr />
        <p>À bientôt sur Supchat 🚀</p>
      </div>
    </div>
  );
};

export default AccountConfirmedPage;
