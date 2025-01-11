import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Fa from 'react-icons/fa6';
import { isMobile } from 'react-device-detect';

import { loginUser } from '../../services/Users';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import Link from '../../components/Link/Link';
import logo from '../../assets/logo.png';

import {jwtDecode} from "jwt-decode";

import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [theme, setTheme] = useState('light');

    const navigate = useNavigate();
    const location = useLocation();

    const isLogout = location.state?.logout || false;
    const isExpired = location.state?.expired || false;
    const isConfirmed = location.state?.confirmed || false;
    const isPasswordReseted = location.state?.password_reseted || false;


    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
        try {
            const decodedToken = jwtDecode(token); 
            localStorage.setItem("user", JSON.stringify({ token, data: decodedToken }));
            window.history.replaceState({}, document.title, "/");
            navigate("/dashboard");
        } catch (error) {
            console.error("Erreur lors du décodage du token :", error);
        }
    }
    
        if (isLogout) {
            localStorage.removeItem("user");
            toast.info("Vous avez été déconnecté.", { position: "top-center" });
        }
    
        if (isExpired) {
            localStorage.removeItem("user");
            toast.info("Votre connexion a expiré. Veuillez vous réauthentifier.", { position: "top-center" });
        }
    
        if (isConfirmed) {
            toast.info("Votre compte a été confirmé. Vous pouvez maintenant vous authentifier.", { position: "top-center" });
        }
    
        if (isPasswordReseted) {
            toast.info("Votre nouveau mot de passe a été enregistré.", { position: "top-center" });
        }
    
        if (localStorage.getItem("user")) {
            navigate("/dashboard");
        }
    
        if (localStorage.getItem("gui.theme")) {
            setTheme(localStorage.getItem("gui.theme"));
        }
    }, [isLogout, isExpired, isConfirmed, isPasswordReseted, navigate]);
    


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const data = await loginUser({ email, password });

            if (data.error !== 0) {
                switch (data.error) {
                    case 9:
                        toast.error('E-mail non valide.', { position: 'top-center' });
                        break;
                    case 10:
                        toast.error('Mot de passe incorrect.', { position: 'top-center' });
                        break;
                    case 53:
                        toast.error("Votre compte n'a pas été confirmé.", { position: 'top-center' });
                        break;
                    default:
                        toast.error('Une erreur est survenue.', { position: 'top-center' });
                        break;
                }
                return;
            }

            localStorage.setItem(
                'user',
                JSON.stringify({
                    data: data.result,
                    token: data.token,
                })
            );

            navigate('/dashboard');
        } catch (error) {
            if (process.env.REACT_APP_ENV === 'dev') {
                console.error(error);
            }
            toast.error('Une erreur inattendue est survenue.', { position: 'top-center' });
        }
    };
 
    const handleGoogle = () => {  // VEUILLEZ ME MP SUR DISCORD OU TEAMS POUR LE .ENV (zak)
        window.location.href = `${process.env.REACT_APP_API_URL}users/auth/google`;
    };

    const handleFacebook = () => {
        window.location.href = `https://www.facebook.com/v15.0/dialog/oauth?client_id=${process.env.REACT_APP_FACEBOOK_APP_ID}&redirect_uri=${process.env.REACT_APP_API_URL}users/auth/facebook/callback&scope=email`;
    };

    return (
        <div className={`login-container ${theme}`}>
            <a className="login-logo" href="/" style={isMobile ? { display: 'none' } : {}}>
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
                            <Link text="Mot de passe oublié ?" onClick={() => navigate('/reset_password')} />
                        </p>
                    </div>
                    <div>
                        <Button type="submit" text="Se connecter" theme={theme} />
                        <p>
                            Pas de compte ?{' '}
                            <Link text="En créer un maintenant !" onClick={() => navigate('/register')} />
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
