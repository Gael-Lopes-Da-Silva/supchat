import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import * as Fa from "react-icons/fa6";

import Button from "../../components/Button/Button";
import InputField from "../../components/InputField/InputField";
import Link from "../../components/Link/Link";

import logo from "../../assets/logo.png";

import {
    loginUser,
    updateUser,
} from "../../services/Users";

import "./LoginPage.css";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [theme] = useState(localStorage.getItem("gui.theme") ?? "light");

    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                localStorage.setItem("user", JSON.stringify({
                    token: token,
                    data: decodedToken,
                }));

                window.history.replaceState({}, document.title, "/");
                navigate("/dashboard");
            } catch (error) {
                if (process.env.REACT_APP_DEBUG) {
                    console.trace({
                        from: "jwtDecode() -> LoginPage.jsx",
                        error: error,
                    });
                }
            }
        }

        if (localStorage.getItem("user")) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        loginUser({
            email: email,
            password: password,
        }).then((data) => {
            if (data.error !== 0) {
                switch (data.error) {
                    case 9:
                        toast.error("E-mail non valide.", {
                            position: "top-center",
                        });
                        break;

                    case 10:
                        toast.error("Mot de passe incorrect.", {
                            position: "top-center",
                        });
                        break;

                    case 54:
                        toast.error("Veuillez confirmer votre email avant de vous connecter.", {
                            position: "top-center",
                        });
                        break;

                    default:
                        toast.error("Une erreur est survenue.", {
                            position: "top-center",
                        });
                        break;
                }
                return;
            }

            if (!data.token) {
                toast.error("Erreur lors de la connexion. Veuillez réessayer.", {
                    position: "top-center",
                });

                return;
            }

            if (data.result.password_reset_token !== null) {
                updateUser(data.result.id, {
                    password_reset_token: null,
                }).catch((error) => {
                    toast.error("Une erreur inattendue est survenue.", {
                        position: "top-center",
                    });

                    if (process.env.REACT_APP_DEBUG) {
                        console.trace({
                            from: "loginUser() -> LoginPage.jsx",
                            error: error,
                        });
                    }
                });
            }

            const decodedToken = jwtDecode(data.token);
            localStorage.setItem("user", JSON.stringify({
                token: data.token,
                data: decodedToken,
            }));

            navigate("/dashboard");
        }).catch((error) => {
            toast.error("Une erreur inattendue est survenue.", {
                position: "top-center",
            });

            if (process.env.REACT_APP_DEBUG) {
                console.trace({
                    from: "loginUser() -> LoginPage.jsx",
                    error: error,
                });
            }
        });
    };

    const handleGoogle = () => {
        window.location.href = `${process.env.REACT_APP_API_URL}users/auth/google`;
    };

    const handleFacebook = () => {
        window.location.href = `https://www.facebook.com/v15.0/dialog/oauth?client_id=${process.env.REACT_APP_FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_API_URL}users/auth/facebook/callback&scope=email`;
    };

    return (
        <div className={`login-container ${theme}`}>
            <a
                className="login-logo"
                href="/"
                style={isMobile ? { display: "none" } : {}}
            >
                <img src={logo} alt="Supchat logo" />
                <p>Supchat</p>
            </a>
            <div className="login-box">
                <h1>Connexion</h1>   
                <form onSubmit={handleSubmit}>
                    <div>
                        <InputField
                            label="E-mail"
                            type="email"
                            theme={theme}
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <InputField
                            label="Mot de passe"
                            type="password"
                            theme={theme}
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <p>
                            <Link
                                text="Mot de passe oublié ?"
                                onClick={() => navigate("/reset_password")}
                            />
                        </p>
                    </div>
                    <div>
                        <Button type="submit" text="Se connecter" theme={theme} />
                        <p>
                            Pas de compte ?{" "}
                            <Link
                                text="En créer un maintenant !"
                                onClick={() => navigate("/register")}
                            />
                        </p>
                    </div>
                </form>
                <div className="login-socials">
                    <Button
                        icon={<Fa.FaGoogle />}
                        onClick={handleGoogle}
                        type="button"
                        text="Google"
                        theme={theme}
                    />
                    <Button
                        icon={<Fa.FaFacebook />}
                        onClick={handleFacebook}
                        type="button"
                        text="Facebook"
                        theme={theme}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
