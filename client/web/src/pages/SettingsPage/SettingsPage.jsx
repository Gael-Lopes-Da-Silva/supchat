import * as react from 'react';
import * as Fa from 'react-icons/fa6';

import { authentificationHook } from '../../hooks/Authentification';

import "./SettingsPage.css"

const SettingsPage = () => {
    const [user, setUser] = react.useState('');

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
                        <a title='Fermer les paramètres' href="/dashboard"><Fa.FaXmark /></a>
                    </div>
                </header>
                <main></main>
            </div>
        </div>
    );
};

export default SettingsPage;