import React, { useEffect, useState } from 'react';

import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';

import { registerUser } from '../../services/auth';

import './RegisterPage.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
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

        registerUser(username, email, password).then((data) => {
            
        }).catch((error) => {
            console.error(error);
        });
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Création de compte</h1>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Pseudo"
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <InputField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <InputField
                        label="Mot de passe"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <Button type="submit" text="Enregistrer" />
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;