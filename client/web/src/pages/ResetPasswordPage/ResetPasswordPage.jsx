import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from '../../components/Button/Button';
import InputField from '../../components/InputField/InputField';
import Link from '../../components/Link/Link';

import * as PasswordReset from "../../emails/PasswordReset";
import * as PostPasswordReset from "../../emails/PostPasswordReset";

import {
    sendEmail,
} from '../../services/Email';
import {
    readUserByEmail,
    updateUser,
} from '../../services/Users';

import logo from "../../assets/logo.png";

import './ResetPasswordPage.css';

const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const [checkMail, setCheckMail] = useState(false);
    const [user, setUser] = useState(null);
    const [theme] = useState(localStorage.getItem('gui.theme') ?? "light");
    const [resetToken, setResetToken] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const token = query.get("token");
        const email = query.get("email");

        if (token && email) {
            setCheckMail(true);
            setResetToken(token);
            
            // Récupérer l'utilisateur avec l'email
            readUserByEmail(email, process.env.REACT_APP_API_URL).then((data) => {
                if (!data.error && data.result) {
                    setUser(data.result);
                } else {
                    toast.error("Lien de réinitialisation invalide.", {
                        position: "top-center",
                    });
                    navigate("/login");
                }
            }).catch((error) => {
                toast.error("Une erreur est survenue lors de la récupération de l'utilisateur.", {
                    position: "top-center",
                });
                navigate("/login");
            });
        }

        if (localStorage.getItem('user')) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleResetPassword = async (event) => {
        event.preventDefault();

        if (!user) {
            toast.error("Utilisateur non trouvé.", {
                position: "top-center",
            });
            return;
        }

        if (password !== checkPassword) {
            toast.error("Les mots de passe sont différents.", {
                position: "top-center",
            });
            return;
        }

        updateUser(user.id, {
            password: password
        }, process.env.REACT_APP_API_URL).then(() => {
            sendEmail({
                to: user.email,
                subject: PostPasswordReset.subject(),
                content: PostPasswordReset.content(),
            }, null).catch((error) => {
                console.error("Erreur d'envoi d'email de confirmation:", error);
            });

            toast.success("Votre nouveau mot de passe a été enregistré.", {
                position: "top-center",
            });

            navigate("/login")
        }).catch((error) => {
            toast.error("Une erreur inattendue est survenue.", {
                position: "top-center",
            });

            if (process.env.REACT_APP_DEBUG) {
                console.trace({
                    from: "updateUser() -> ResetPasswordPage.jsx",
                    error: error,
                });
            }
        });
    };

    const handleCheckEmail = async (event) => {
        event.preventDefault();

        readUserByEmail(email, process.env.REACT_APP_API_URL).then((data) => {
            if (data.error || !data.result) {
                toast.error("E-mail non valide.", {
                    position: "top-center",
                });
                return;
            }

            const user = data.result;
            if (user.provider !== null) {
                toast.error("Ce compte utilise une connexion externe (Google/Facebook).", {
                    position: "top-center",
                });
                return;
            }

            // Générer un token unique pour la réinitialisation
            const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            
            // Construire l'URL complète de réinitialisation
            const resetUrl = `${process.env.REACT_APP_BASE_URL}reset_password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;
            
            sendEmail({
                to: user.email,
                subject: PasswordReset.subject(),
                content: PasswordReset.content(resetUrl),
            }, null).catch((error) => {
                toast.error("Une erreur inattendue est survenue.", {
                    position: "top-center",
                });

                if (process.env.REACT_APP_DEBUG) {
                    console.trace({
                        from: "sendMail() -> ResetPasswordPage.jsx",
                        error: error,
                    });
                }
            });

            toast.success("Un mail de modification de mot de passe vous a été envoyé, veuillez vérifier votre boîte mail.", {
                position: "top-center",
            });

            navigate("/login");
        }).catch((error) => {
            toast.error("Une erreur inattendue est survenue.", {
                position: "top-center",
            });

            if (process.env.REACT_APP_DEBUG) {
                console.trace({
                    from: "readUserByEmail() -> ResetPasswordPage.jsx",
                    error: error,
                });
            }
        });
    }

    return (
        <div className={`reset-password-container ${theme}`}>
            <a className='reset-password-logo' href='/'>
                <img src={logo} alt="Supchat logo" />
                <p>Supchat</p>
            </a>
            {!checkMail &&
                <div className="reset-password-box">
                    <h1>Vérification de l'adresse mail</h1>
                    <form onSubmit={handleCheckEmail}>
                        <InputField
                            label="E-mail"
                            type="email"
                            theme={theme}
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button type="submit" text="Vérifier" theme={theme} />
                        <Link text="Retour à la connexion" onClick={() => navigate("/login")} />
                    </form>
                </div>
            }
            {checkMail &&
                <div className="reset-password-box">
                    <h1>Réinitialisation du mot de passe</h1>
                    <form onSubmit={handleResetPassword}>
                        <InputField
                            label="Nouveau mot de passe"
                            type="password"
                            theme={theme}
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputField
                            label="Confirmer le mot de passe"
                            type="password"
                            theme={theme}
                            value={checkPassword}
                            required
                            onChange={(e) => setCheckPassword(e.target.value)}
                        />
                        <Button type="submit" text="Réinitialiser" theme={theme} />
                        <Link text="Retour à la connexion" onClick={() => navigate("/login")} />
                    </form>
                </div>
            }
        </div>
    );
};

export default ResetPasswordPage;