import react from 'react';
import { isMobile } from 'react-device-detect';
import { toast } from 'react-toastify';

import {
    createUser,
    readUser,
    updateUser,
} from '../../services/Users';

import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import logo from "../../assets/logo.png";

import './RegisterPage.css';

const RegisterPage = () => {
    const [username, setUsername] = react.useState('');
    const [email, setEmail] = react.useState('');
    const [password, setPassword] = react.useState('');
    const [checked, setChecked] = react.useState('');

    react.useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (query.get("confirm_token") !== null) {
            const confirmToken = query.get("confirm_token");

            readUser({
                confirm_token: confirmToken
            }).then((data) => {
                const [user] = data.result;
                if (!user) {
                    window.location.href = '/login';
                    return;
                }

                updateUser(user.id, {
                    confirm_token: null
                }).then(() => {
                    // TODO: Envoyer un mail de confirmation et de bienvenue
                    window.location.href = '/login';
                }).catch((error) => console.error(error));
            }).catch((error) => console.error(error));

            return;
        }

        if (localStorage.getItem('token')) {
            window.location.href = '/dashboard';
            return;
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const confirmToken = Math.random().toString(36);

        createUser({
            username: username,
            email: email,
            password: password,
            confirm_token: confirmToken,
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
                        break;
                }
                return;
            }

            // TODO: Envoyer un mail pour confirmer son compte et son adresse mail
            toast.success("Activez votre compte à cette adresse: " + window.location.protocol + '//' + window.location.host + "/register?confirm_token=" + confirmToken, {
                position: "top-center",
            });
        }).catch((error) => console.error(error));
    };

    return (
        <div className="register-container">
            <a className='register-logo' href='/' style={isMobile ? { display: 'none' } : {}}>
                <img src={logo} alt="Supchat logo" />
                <p>Supchat</p>
            </a>
            <div className="register-box">
                <h1>Création d'un compte</h1>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Pseudo"
                        error="*"
                        type="text"
                        value={username}
                        required={true}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <InputField
                        label="Email"
                        error="*"
                        type="email"
                        value={email}
                        required={true}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <InputField
                        label="Mot de passe"
                        error="*"
                        type="password"
                        value={password}
                        required={true}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <div className="register-checkbox">
                        <label onChange={() => setChecked(!checked)}>
                            <input type="checkbox" />
                            <span></span>
                        </label>
                        <p>J'ai lu et j'accept les <a href="/terms">conditions d'utilisation</a> et la <a href="/privacy">politique de confidentialité</a> de Supchat.</p>
                    </div>
                    <Button type="submit" text="S'enregistrer" disabled={!checked ? true : false} />
                    <p>Déjà un compte ? <a href="/login">Se connecter maintenant !</a></p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;