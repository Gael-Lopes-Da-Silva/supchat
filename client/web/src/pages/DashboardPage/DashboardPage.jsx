import react from 'react';
import * as reactdom from 'react-router-dom';
import * as Fa from 'react-icons/fa6';

import { authentificationHook } from '../../hooks/Authentification';

import Popup from "../../components/Popup/Popup";

import "./DashboardPage.css"

const DashboardPage = () => {
    const [showUserList, setShowUserList] = react.useState(true);
    const [showLeftPanel, setShowLeftPanel] = react.useState(false);
    const [user, setUser] = react.useState('');

    const [showProfilePopup, setShowProfilePopup] = react.useState(false);

    const navigate = reactdom.useNavigate();

    react.useEffect(() => {
        authentificationHook(navigate);

        setUser(JSON.parse(localStorage.getItem('user')).data);

        const showUserList = localStorage.getItem("gui.dashboard.show_user_list");
        const showLeftPanel = localStorage.getItem("gui.dashboard.show_left_panel");
        if (showUserList !== null) setShowUserList(showUserList === "true");
        if (showLeftPanel !== null) setShowLeftPanel(showLeftPanel === "true");
    }, []);

    const userProfileBackground = (username) => {
        let hash = 0;
        for (let i = 0; i < username.length; i++) {
            hash = (hash << 5) - hash + username.charCodeAt(i);
        }

        return `#${((hash >> 24) & 0xFF).toString(16).padStart(2, '0')}${((hash >> 16) & 0xFF).toString(16).padStart(2, '0')}${((hash >> 8) & 0xFF).toString(16).padStart(2, '0')}`;
    }

    const userProfileForeground = (username) => {
        const background = userProfileBackground(username);
        const color = background.replace('#', '');

        const r = parseInt(color.substring(0, 2), 16) / 255;
        const g = parseInt(color.substring(2, 4), 16) / 255;
        const b = parseInt(color.substring(4, 6), 16) / 255;

        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    }

    const toggleUsersList = () => {
        setShowUserList(!showUserList);
        localStorage.setItem('gui.dashboard.show_user_list', !showUserList);
    }

    const toggleLeftPanel = () => {
        setShowLeftPanel(!showLeftPanel);
        localStorage.setItem('gui.dashboard.show_left_panel', !showLeftPanel);
    }

    const handleLogout = () => {
        navigate("/login", { state: { logout: true } });
    }

    return (
        <div onClick={() => { showProfilePopup && setShowProfilePopup(false) }} className="dashboard-container">
            <Popup display={showProfilePopup} content={
                <div>
                    <header></header>
                    <main>
                        <button onClick={handleLogout}>Deconnexion</button>
                    </main>
                    <footer></footer>
                </div>
            } bottom={100} left={200} />
            <div className="dashboard-left" style={{ display: !showLeftPanel && "none" }}>
                <div className='dashboard-left-workspaces'>
                </div>
                <div className='dashboard-left-content'>
                    <header></header>
                    <main></main>
                    <footer>
                        <div onClick={() => { setShowProfilePopup(true) }} className='dashboard-left-footer-profile'>
                            <div style={{ background: userProfileBackground(user && user.username), color: userProfileForeground(user && user.username) }}>{user && user.username[0].toUpperCase()}</div>
                            <p>{user && user.username}</p>
                        </div>
                        <div className='dashboard-left-footer-buttons'>
                            <a title='Paramètres utilisateur' href="/settings"><Fa.FaGear /></a>
                        </div>
                    </footer>
                </div>
            </div>
            <div className="dashboard-right">
                <div className='dashboard-right-content'>
                    <header>
                        <div className='dashboard-right-header-buttons'>
                            <button onClick={toggleLeftPanel} title='Afficher/Masquer le panneau de gauche'><Fa.FaBars /></button>
                        </div>
                        <div className='dashboard-right-header-buttons'>
                            <button title='Messages épinglés'><Fa.FaThumbtack /></button>
                            <button title='Notifications'><Fa.FaBell /></button>
                            <button onClick={toggleUsersList} title='Afficher/Masquer la liste des utilisateur'><Fa.FaUserGroup /></button>
                        </div>
                    </header>
                    <main></main>
                    <footer></footer>
                </div>
                <div className='dashboard-right-peoples' style={{ display: !showUserList && "none" }}>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
