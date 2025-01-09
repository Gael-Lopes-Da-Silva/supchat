import * as react from 'react';
import * as reactdom from 'react-router-dom';
import * as reactdevices from 'react-device-detect';
import * as reacttoastify from 'react-toastify';
import * as Fa from 'react-icons/fa6';

import {
    loginUser
} from '../../services/Users';

import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import logo from "../../assets/logo.png";

import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = react.useState('');
    const [password, setPassword] = react.useState('');
    
    const [theme, setTheme] = react.useState('light');
    
    const navigate = reactdom.useNavigate();
    const location = reactdom.useLocation();
    
    const isLogout = location.state?.logout || false;
    const isExpired = location.state?.expired || false;
    const isConfirmed = location.state?.confirmed || false;
    const isPasswordReseted = location.state?.password_reseted || false;

    react.useEffect(() => {
        if (isLogout) {
            localStorage.removeItem('user');
            reacttoastify.toast.info("Vous avez été déconnecté.", {
                position: "top-center",
            });
        }
        
        if (isExpired) {
            localStorage.removeItem('user');
            reacttoastify.toast.info("Votre connexion à éxpiré. Veuillez vous réauthentifier.", {
                position: "top-center",
            });
        }
        
        if (isConfirmed) {
            reacttoastify.toast.info("Votre compte à été confirmé. Vous pouvez maintenant vous authentifier.", {
                position: "top-center",
            });
        }
        
        if (isPasswordReseted) {
            reacttoastify.toast.info("Votre nouveau mot de passe a été enregistré.", {
                position: "top-center",
            });
        }

        if (localStorage.getItem('user')) {
            navigate("/dashboard")
        }
        
        if (localStorage.getItem('gui.theme')) {
            setTheme(localStorage.getItem('gui.theme'));
        }
    }, [isLogout, isExpired, isConfirmed, isPasswordReseted]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        loginUser({
            email: email,
            password: password,
        }).then((data) => {
            if (data.error !== 0) {
                switch (data.error) {
                    case 9:
                        reacttoastify.toast.error("E-mail non valide.", {
                            position: "top-center",
                        });
                        break;

                    case 10:
                        reacttoastify.toast.error("Mot de passe incorrect.", {
                            position: "top-center",
                        });
                        break;

                    case 53:
                        reacttoastify.toast.error("Votre compte n'a pas été confirmé.", {
                            position: "top-center",
                        });
                        break;

                    default:
                        break;
                }
                return;
            }

            localStorage.setItem('user', JSON.stringify({
                data: data.result,
                token: data.token,
            }));

            navigate("/dashboard");
        }).catch((error) => {
            if (process.env.REACT_APP_ENV === "dev") console.error(error);
        });
    };

    const handleGoogle = async (event) => {

    }

    const handleFacebook = async (event) => {

    }

    return (
        <div className={`login-container ${theme}`}>
            <a className='login-logo' href='/' style={reactdevices.isMobile ? { display: 'none' } : {}}>
                <img src={logo} alt="Supchat logo" />
                <p>Supchat</p>
            </a>
            <div className="login-box">
                <h1>Connexion</h1>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="E-mail"
                        type="email"
                        theme={theme}
                        value={email}
                        required={true}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputField
                        label="Mot de passe"
                        type="password"
                        theme={theme}
                        value={password}
                        required={true}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <a className='login-reset-password' href="/reset_password">Mot de passe oublié ?</a>
                    <Button type="submit" text="Se connecter" theme={theme} />
                    <p>Pas de compte ? <a href="/register">En créer un maintenant !</a></p>
                </form>
                <div className='login-socials'>
                    <Button icon={<Fa.FaGoogle />} onClick={handleGoogle} type="button" text="Google" theme={theme} />
                    <Button icon={<Fa.FaFacebook />} onClick={handleFacebook} type="button" text="Facebook" theme={theme} />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
