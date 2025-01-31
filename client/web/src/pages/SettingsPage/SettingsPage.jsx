import * as react from 'react';
import * as reactdom from 'react-router-dom';
import * as Fa from 'react-icons/fa6';

import $ from 'jquery';

import { authentificationHook } from '../../hooks/Authentification';

import "./SettingsPage.css"

const SettingsPage = () => {
    const [user, setUser] = react.useState('');
    const [theme, setTheme] = react.useState(localStorage.getItem('gui.theme') ?? 'light');

    const [guiVisibility, setGuiVisibility] = react.useState({
        settingsMenu: {
            myAccount: true,
            appearance: false,
        },
    });

    const navigate = reactdom.useNavigate();

    react.useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')).data);
    }, []);

    const updateGuiState = (key, value) => {
        setGuiVisibility((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className={`settings-container ${theme}`}>
            <div className="settings-left">
                <div className='settings-left-categorie'>
                    <p>Paramètre utilisateur</p>
                    <hr />
                    <div className='settings-left-categorie-buttons'>
                        <button onClick={() => {
                            updateGuiState("settingsMenu", {
                                myAccount: true,
                                appearance: false,
                            });
                        }}>Mon compte<span style={{ display: !guiVisibility.settingsMenu.myAccount ? "none" : "" }}></span></button>
                    </div>
                </div>
                <div className='settings-left-categorie'>
                    <p>Paramètre de l'application</p>
                    <hr />
                    <div className='settings-left-categorie-buttons'>
                        <button onClick={() => {
                            updateGuiState("settingsMenu", {
                                myAccount: false,
                                appearance: true,
                            });
                        }}>Apparence<span style={{ display: !guiVisibility.settingsMenu.appearance ? "none" : "" }}></span></button>
                    </div>
                </div>
            </div>
            {guiVisibility.settingsMenu.myAccount &&
                <div className="settings-right">
                    <header>
                        <p>Mon compte</p>
                        <div className='settings-right-header-buttons'>
                            <button onClick={() => {
                                navigate("/dashboard");
                            }} title='Fermer les paramètres'><Fa.FaXmark /></button>
                        </div>
                    </header>
                    <main></main>
                </div>
            }
            {guiVisibility.settingsMenu.appearance &&
                <div className="settings-right">
                    <header>
                        <p>Apparence</p>
                        <div className='settings-right-header-buttons'>
                            <button onClick={() => {
                                navigate("/dashboard");
                            }} title='Fermer les paramètres'><Fa.FaXmark /></button>
                        </div>
                    </header>
                    <main>
                        <div className='settings-right-main-theme'>
                            <button className='light' style={{ borderColor: theme !== "light" ? "dark" : "#23A55A" }} onClick={(event) => {
                                $(".settings-right-main-theme>button").css("border-color", "black");
                                $(event.currentTarget).css("border-color", "#23A55A");
                                setTheme("light");
                                localStorage.setItem('gui.theme', "light");
                            }}><Fa.FaCheck style={{ display: theme !== "light" ? "none" : "" }} /></button>
                            <button className='dark' style={{ borderColor: theme !== "dark" ? "dark" : "#23A55A" }} onClick={(event) => {
                                $(".settings-right-main-theme>button").css("border-color", "black");
                                $(event.currentTarget).css("border-color", "#23A55A");
                                setTheme("dark");
                                localStorage.setItem('gui.theme', "dark");
                            }}><Fa.FaCheck style={{ display: theme !== "dark" ? "none" : "" }} /></button>
                        </div>
                    </main>
                </div>
            }
        </div>
    );
};

export default SettingsPage;