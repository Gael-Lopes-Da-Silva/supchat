import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../../components/Button/Button";
import Checkbox from "../../components/Checkbox/Checkbox";
import InputField from "../../components/InputField/InputField";
import Link from "../../components/Link/Link";

import * as ConfirmationEmail from "../../emails/Confirmation";
import * as PostConfirmationEmail from "../../emails/PostConfirmation";

import {
    sendEmail,
} from "../../services/Services/Email";
import {
    createUser,
    readUser,
    updateUser,
} from "../../services/Users";

import logo from "../../assets/logo.png";

import "./RegisterPage.css";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [checked, setChecked] = useState(false);
    const [theme, setTheme] = useState("light");

    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const confirm_token = query.get("confirm_token");

        if (confirm_token) {
            readUser({
                confirm_token: confirm_token,
            }).then((data) => {
                if (data.result.lenght !== 0) {
                    const [user] = data.result;

                    updateUser(user.id, {
                        confirm_token: null,
                    }).then((data) => {
                        sendEmail({
                            to: user.email,
                            subject: PostConfirmationEmail.subject(),
                            content: PostConfirmationEmail.content(),
                        }).catch((error) => {
                            toast.error("Une erreur inattendue est survenue.", {
                                position: "top-center",
                            });

                            if (process.env.REACT_APP_DEBUG) {
                                console.trace({
                                    from: "sendMail() -> RegisterPage.jsx",
                                    error: error,
                                });
                            }
                        });

                        toast.success("Votre compte a bien été confirmé. Maintenant, veuillez vous authentifier.", {
                            position: "top-center",
                        });

                        navigate("/login");
                    }).catch((error) => {
                        toast.error("Une erreur inattendue est survenue.", {
                            position: "top-center",
                        });

                        if (process.env.REACT_APP_DEBUG) {
                            console.trace({
                                from: "updateUser() -> RegisterPage.jsx",
                                error: error,
                            });
                        }
                    });
                }
            }).catch((error) => {
                toast.error("Une erreur inattendue est survenue.", {
                    position: "top-center",
                });

                if (process.env.REACT_APP_DEBUG) {
                    console.trace({
                        from: "readUser() -> RegisterPage.jsx",
                        error: error,
                    });
                }
            });
        }

        if (localStorage.getItem("user")) {
            navigate("/dashboard");
        }

        const savedTheme = localStorage.getItem("gui.theme");
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        createUser({
            username: username,
            email: email,
            password: password,
        }).then((data) => {
            if (data.error !== 0) {
                switch (data.error) {
                    case 4:
                        toast.error("Ce pseudo est déjà utilisé par un autre utilisateur.", {
                            position: "top-center",
                        });
                        break;

                    case 5:
                        toast.error("Cette e-mail est déjà utilisé par un autre utilisateur.", {
                            position: "top-center",
                        });
                        break;

                    default:
                        toast.error("Une erreur est survenue lors de l'inscription.", {
                            position: "top-center",
                        });
                }
                return;
            }

            readUser({
                id: data.result.insertId,
            }).then((data) => {
                sendEmail({
                    to: email,
                    subject: ConfirmationEmail.subject(),
                    content: ConfirmationEmail.content(data.result.confirm_token),
                }).catch((error) => {
                    toast.error("Une erreur inattendue est survenue.", {
                        position: "top-center",
                    });

                    if (process.env.REACT_APP_DEBUG) {
                        console.trace({
                            from: "sendMail() -> RegisterPage.jsx",
                            error: error,
                        });
                    }
                });

                toast.success("Votre compte a été créé. Veuillez vérifier votre boîte mail afin de confirmer votre compte et de pouvoir vous authentifier.", {
                    position: "top-center",
                });

                navigate("/login");
            }).catch((error) => {
                toast.error("Une erreur inattendue est survenue.", {
                    position: "top-center",
                });

                if (process.env.REACT_APP_DEBUG) {
                    console.trace({
                        from: "readUser() -> RegisterPage.jsx",
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
                    from: "createUser() -> RegisterPage.jsx",
                    error: error,
                });
            }
        });
    };

    return (
        <div className={`register-container ${theme}`}>
            <a
                className="register-logo"
                href="/"
            >
                <img src={logo} alt="Supchat logo" />
                <p>Supchat</p>
            </a>
            <div className="register-box">
                <h1>Création d'un compte</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <InputField
                            label="Pseudo"
                            error="*"
                            theme={theme}
                            type="text"
                            value={username}
                            required
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <InputField
                            label="Email"
                            error="*"
                            theme={theme}
                            type="email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <InputField
                            label="Mot de passe"
                            error="*"
                            theme={theme}
                            type="password"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Checkbox
                            theme={theme}
                            onChange={() => setChecked(!checked)}
                            required={true}
                            label={
                                <p>
                                    J'ai lu et j'accepte les{" "}
                                    <Link
                                        text="conditions d'utilisation"
                                        onClick={() => navigate("/terms")}
                                    />{" "}
                                    et la{" "}
                                    <Link
                                        text="politique de confidentialité"
                                        onClick={() => navigate("/privacy")}
                                    />{" "}
                                    de Supchat.
                                </p>
                            }
                        />
                    </div>
                    <div>
                        <Button
                            type="submit"
                            text="S'enregistrer"
                            theme={theme}
                            disabled={!checked}
                        />
                        <p>
                            Déjà un compte ?{" "}
                            <Link
                                text="Se connecter maintenant !"
                                onClick={() => navigate("/login")}
                            />
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
