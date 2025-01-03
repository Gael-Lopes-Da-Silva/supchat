import React, { useEffect, useState } from 'react';

import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';

import { loginUser } from '../../services/auth';

import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            window.location.href = '/dashboard';
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        loginUser(email, password).then((data) => {
            if (data === "") {
                setError('Email ou mot de passe incorrect.');
                return;
            }
            
            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard';
        }).catch((error) => {
            console.error(error);
        });
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Connexion</h1>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputField
                        label="Mot de passe"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className="error-message">{error}</p>}
                    <Button type="submit" text="Se Connecter" />
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
