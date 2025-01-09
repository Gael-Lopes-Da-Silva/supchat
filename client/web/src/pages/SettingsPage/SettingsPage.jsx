import * as react from 'react';
import * as reactdom from 'react-router-dom';
import * as Fa from 'react-icons/fa6';

import { authentificationHook } from '../../hooks/Authentification';

import "./SettingsPage.css"

const SettingsPage = () => {
    const [user, setUser] = react.useState('');

    const [theme, setTheme] = react.useState('light');
    
    const navigate = reactdom.useNavigate();
    
    react.useEffect(() => {
        authentificationHook();

        setUser(JSON.parse(localStorage.getItem('user')).data);
        
        if (localStorage.getItem('gui.theme')) {
            setTheme(localStorage.getItem('gui.theme'));
        }
    }, []);

    return (
        <div className={`settings-container ${theme}`}>
            <div className="settings-left">
            </div>
            <div className="settings-right">
                <header>
                    <div className='settings-right-header-buttons'>
                        <button onClick={() => {
                            navigate("/dashboard");
                        }} title='Fermer les paramètres'><Fa.FaXmark /></button>
                    </div>
                </header>
                <main></main>
            </div>
        </div>
    );
};

export default SettingsPage;