import * as react from 'react';
import * as reactdom from 'react-router-dom';
import * as Fa from 'react-icons/fa6';

import { authentificationHook } from '../../hooks/Authentification';

import "./SettingsPage.css"

const SettingsPage = () => {
    const [user, setUser] = react.useState('');

    const navigate = reactdom.useNavigate();
    
    react.useEffect(() => {
        authentificationHook();

        setUser(JSON.parse(localStorage.getItem('user')).data);
    }, []);

    return (
        <div className="settings-container">
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