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
} from '../../services/Services/Email';
import {
    readUser,
    updateUser,
} from '../../services/Users';

import logo from "../../assets/logo.png";

import './ResetPasswordPage.css';

const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const [checkMail, setCheckMail] = useState(false);
    const [user, setUser] = useState('');
    const [theme] = useState(localStorage.getItem('gui.theme') ?? "light");

    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const password_reset_token = query.get("password_reset_token");

        if (password_reset_token) {
            setCheckMail(true);

            readUser({
                password_reset_token: password_reset_token
            }).then((data) => {
                const [user] = data.result;
                if (!user) navigate("/login");

                setUser(user);
            }).catch((error) => {
                toast.error("Une erreur inattendue est survenue.", {
                    position: "top-center",
                });

                if (process.env.REACT_APP_DEBUG) {
                    console.trace({
                        from: "readUser() -> ResetPasswordPage.jsx",
                        error: error,
                    });
                }
            });
        }

        if (localStorage.getItem('user')) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleResetPassword = async (event) => {
        event.preventDefault();

        if (password !== checkPassword) {
            toast.error("Les mots de passes sont différent.", {
                position: "top-center",
            });

            return;
        }

        updateUser(user.id, {
            password: password,
            reset_password_token: null,
        }).then((_) => {
            sendEmail({
                to: user.email,
                subject: PostPasswordReset.subject(),
                content: PostPasswordReset.content(),
            }, null).catch((error) => {
                toast.error("Une erreur inattendue est survenue.", {
                    position: "top-center",
                });

                if (process.env.REACT_APP_DEBUG) {
                    console.trace({
                        from: "sendEmail() -> ResetPasswordPage.jsx",
                        error: error,
                    });
                }
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

        readUser({
            email: email,
            provider: "local",
        }).then((data) => {
            const [user] = data.result;
            if (!user) {
                toast.error("E-mail non valide.", {
                    position: "top-center",
                });

                return;
            }

            updateUser(user.id, {
                password_reset_token: "random",
            }).then((_) => {
                readUser({
                    email: email
                }).then((data) => {
                    const [user] = data.result;

                    sendEmail({
                        to: user.email,
                        subject: PasswordReset.subject(),
                        content: PasswordReset.content(user.password_reset_token),
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

                    toast.success("Un mail de modification de mot de passe vous a été envoyer, veuillez vérifer votre boîte mail.", {
                        position: "top-center",
                    });

                    navigate("/login");
                });
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
        }).catch((error) => {
            toast.error("Une erreur inattendue est survenue.", {
                position: "top-center",
            });

            if (process.env.REACT_APP_DEBUG) {
                console.trace({
                    from: "readUser() -> ResetPasswordPage.jsx",
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
                        <div>
                            <InputField
                                label="Email"
                                error="*"
                                type="email"
                                theme={theme}
                                value={email}
                                required={true}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>
                        <div>
                            <Button type="submit" text="Enregistrer" theme={theme} />
                            <p>Pas de compte ? <Link text="En créer un maintenant !" onClick={() => { navigate("/register") }} /></p>
                        </div>
                    </form>
                </div>
            }
            {checkMail &&
                <div className="reset-password-box">
                    <h1>Réinitialisation de mot de passe</h1>
                    <form onSubmit={handleResetPassword}>
                        <div>
                            <InputField
                                label="Mot de passe"
                                error="*"
                                type="password"
                                theme={theme}
                                value={password}
                                required={true}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>
                        <div>
                            <InputField
                                label="Confirmez le mot de passe"
                                error="*"
                                type="password"
                                theme={theme}
                                value={checkPassword}
                                required={true}
                                onChange={(event) => setCheckPassword(event.target.value)}
                            />
                        </div>
                        <div>
                            <Button type="submit" text="Enregistrer" theme={theme} />
                        </div>
                    </form>
                </div>
            }
        </div>
    );
};

export default ResetPasswordPage;