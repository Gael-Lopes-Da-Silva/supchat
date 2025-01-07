import * as react from 'react';
import * as reactdom from 'react-router-dom';
import * as reactdevices from 'react-device-detect';
import * as reacttoastify from 'react-toastify';

import {
    readUser,
    updateUser,
} from '../../services/Users';

import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import logo from "../../assets/logo.png";

import './ResetPasswordPage.css';

const ResetPasswordPage = () => {
    const [email, setEmail] = react.useState('');
    const [password, setPassword] = react.useState('');

    const navigate = reactdom.useNavigate();

    react.useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (query.get("reset_password_token") !== null) {
            const resetPasswordToken = query.get("reset_password_token");

            readUser({
                reset_password_token: resetPasswordToken
            }).then((data) => {
                const [user] = data.result;
                if (!user) {
                    navigate("/login");
                }

                updateUser(user.id, {
                    reset_password_token: null
                }).then(() => {
                    // TODO: Envoyer un mail de confirmation de mot de pass modifié
                    navigate("/login", { state: { reseted: true } });
                }).catch((error) => {
                    if (process.env.REACT_APP_ENV === "dev") console.error(error);
                });
            }).catch((error) => {
                if (process.env.REACT_APP_ENV === "dev") console.error(error);
            });
        }

        if (localStorage.getItem('user')) {
            navigate("/dashboard");
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const resetPasswordToken = Math.random().toString(36);
        
        readUser({
            email: email
        }).then((data) => {
            const [user] = data.result;
            if (!user) {
                reacttoastify.toast.error("E-mail non valide.", {
                    position: "top-center",
                });
                return;
            }
        }).catch((error) => {
            if (process.env.REACT_APP_ENV === "dev") console.error(error);
        });

        updateUser({
            reset_password_token: resetPasswordToken,
        }).then((data) => {
            if (data.error !== 0) {
                switch (data.error) {
                    case 4:
                        reacttoastify.toast.error("Ce pseudo est déjà utilisé par un autre utilisateur.", {
                            position: "top-center",
                        });
                        break;

                    case 5:
                        reacttoastify.toast.error("Cette e-mail est déjà utilisé par un autre utilisateur.", {
                            position: "top-center",
                        });
                        break;

                    default:
                        break;
                }
                return;
            }

            // TODO: Envoyer un mail pour confirmer son compte et son adresse mail
            // Utiliser un SMTP gratuit (sendpulse, jetmail...)
            reacttoastify.toast.success("Modifiez votre mot de passe à cette adresse: " + window.location.protocol + '//' + window.location.host + "/reset_password?reset_password_token=" + resetPasswordToken, {
                position: "top-center",
            });
        }).catch((error) => {
            if (process.env.REACT_APP_ENV === "dev") console.error(error);
        });
    };

    return (
        <div className="reset-password-container">
            <a className='reset-password-logo' href='/' style={reactdevices.isMobile ? { display: 'none' } : {}}>
                <img src={logo} alt="Supchat logo" />
                <p>Supchat</p>
            </a>
            <div className="reset-password-box">
                <h1>Réinitialisation de mot de passe</h1>
                <form onSubmit={handleSubmit}>
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
                    <InputField
                        label="Confirmez le mot de passe"
                        error="*"
                        type="password"
                        value={password}
                        required={true}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <Button type="submit" text="Enregistrer" />
                    <p>Pas de compte ? <a href="/register">En créer un maintenant !</a></p>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;