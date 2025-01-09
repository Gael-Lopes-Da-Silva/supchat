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

    const [checkPassword, setCheckPassword] = react.useState('');
    const [checkMail, setCheckMail] = react.useState(false);
    
    const [theme, setTheme] = react.useState('light');

    const [user, setUser] = react.useState('');

    const navigate = reactdom.useNavigate();

    react.useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (query.get("token") !== null) {
            setCheckMail(true);

            readUser({
                reset_password_token: query.get("token")
            }).then((data) => {
                const [user] = data.result;
                if (!user) {
                    navigate("/login");
                }

                setUser(user);
            }).catch((error) => {
                if (process.env.REACT_APP_ENV === "dev") console.error(error);
            });
        }

        if (localStorage.getItem('user')) {
            navigate("/dashboard");
        }
        
        if (localStorage.getItem('gui.theme')) {
            setTheme(localStorage.getItem('gui.theme'));
        }
    }, [navigate]);

    const handleResetPassword = async (event) => {
        event.preventDefault();

        if (password !== checkPassword) {
            reacttoastify.toast.error("Les mots de passes sont différent.", {
                position: "top-center",
            });
            return;
        }

        updateUser(user && user.id, {
            password: password,
            reset_password_token: null,
        }).then((data) => {
            // TODO: Envoyer un mail pour informer du changement de mot de passe
            navigate("/login", { state: { password_reseted: true } })
        }).catch((error) => {
            if (process.env.REACT_APP_ENV === "dev") console.error(error);
        });
    };

    const handleCheckEmail = async (event) => {
        event.preventDefault();
        const token = Math.random().toString(36);

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

            updateUser(user.id, {
                reset_password_token: token,
            }).then((data) => {
                // TODO: Envoyer un mail avec le lien de réinitialisation de mot de passe
                reacttoastify.toast.success("Veuillez réinitialiser votre mot de passe à cette adresse: " + window.location.protocol + '//' + window.location.host + "/reset_password?token=" + token, {
                    position: "top-center",
                });
            }).catch((error) => { if (process.env.REACT_APP_ENV === "dev") console.error(error); });
        }).catch((error) => { if (process.env.REACT_APP_ENV === "dev") console.error(error); });
    }

    return (
        <div className={`reset-password-container ${theme}`}>
            <a className='reset-password-logo' href='/' style={reactdevices.isMobile ? { display: 'none' } : {}}>
                <img src={logo} alt="Supchat logo" />
                <p>Supchat</p>
            </a>
            {!checkMail &&
                <div className="reset-password-box">
                    <h1>Vérification de l'adresse mail</h1>
                    <form onSubmit={handleCheckEmail}>
                        <InputField
                            label="Email"
                            error="*"
                            type="email"
                            theme={theme}
                            value={email}
                            required={true}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <Button type="submit" text="Enregistrer" theme={theme} />
                        <p>Pas de compte ? <a href="/register">En créer un maintenant !</a></p>
                    </form>
                </div>
            }
            {checkMail &&
                <div className="reset-password-box">
                    <h1>Réinitialisation de mot de passe</h1>
                    <form onSubmit={handleResetPassword}>
                        <InputField
                            label="Mot de passe"
                            error="*"
                            type="password"
                            theme={theme}
                            value={password}
                            required={true}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        <InputField
                            label="Confirmez le mot de passe"
                            error="*"
                            type="password"
                            theme={theme}
                            value={checkPassword}
                            required={true}
                            onChange={(event) => setCheckPassword(event.target.value)}
                        />
                        <Button type="submit" text="Enregistrer" theme={theme} />
                    </form>
                </div>
            }
        </div>
    );
};

export default ResetPasswordPage;