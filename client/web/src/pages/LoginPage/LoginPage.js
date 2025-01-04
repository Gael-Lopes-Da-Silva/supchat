import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { toast } from 'react-toastify';

import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import GoogleButton from '../../components/Button/Google/Google';
import FacebookButton from '../../components/Button/Facebook/Facebook';

import { loginUser } from '../../services/Users';

import logo from "../../assets/logo.png";

import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            window.location.href = '/dashboard';
        }
    }, []);

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

                    case 53:
                        toast.error("Votre compte n'a pas été confirmé.", {
                            position: "top-center",
                        });
                        break;

                    default:
                        break;
                }
                return;
            }

            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard';
        }).catch((error) => {
            console.error(error);
        });
    };

    const handleGoogle = async (event) => {

    }

    const handleFacebook = async (event) => {

    }

    return (
        <div className="login-container">
            <a className='login-logo' href='/' style={isMobile ? { display: 'none' } : {}}>
                <img src={logo} alt="Supchat logo" />
                <p>Supchat</p>
            </a>
            <div className="login-box">
                <h1>Connexion</h1>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="E-mail"
                        type="email"
                        value={email}
                        required={true}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputField
                        label="Mot de passe"
                        type="password"
                        value={password}
                        required={true}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <a className='login-reset-password' href="/reset_password">Mot de passe oublié ?</a>
                    <Button type="submit" text="Se connecter" />
                    <p>Pas de compte ? <a href="/register">En créer un maintenant !</a></p>
                </form>
                <div className='login-socials'>
                    <GoogleButton onClick={handleGoogle} type="submit" text="Google" />
                    <FacebookButton onClick={handleFacebook} type="submit" text="Facebook" />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
