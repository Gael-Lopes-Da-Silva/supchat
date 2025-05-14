import React from 'react';
import * as Fa from "react-icons/fa6";

const HeaderButtons = ({ guiVisibility, updateGuiState, hideAllPopup, updatePopupState, setMousePosition, notifications }) => {
   

    return (
        <>
            <div className="dashboard-right-header-buttons">
                <button
                    onClick={() => {
                        updateGuiState("leftPanel", !guiVisibility.leftPanel);
                    }}
                    title="Afficher/Masquer le panneau de gauche"
                >
                    <Fa.FaBars />
                </button>
            </div>
            <div className="dashboard-right-header-buttons">
                <button
                    onClick={(event) => {
                        event.stopPropagation();
                        hideAllPopup();
                        updatePopupState("pinned", true);
                        setMousePosition({
                            x: event.clientX,
                            y: event.clientY,
                        });
                    }}
                    title="Messages épinglés"
                >
                    <Fa.FaThumbtack />
                </button>
                <button
                    onClick={(event) => {
                        event.stopPropagation();
                        hideAllPopup();
                        updatePopupState("notifications", true);
                        setMousePosition({
                            x: event.clientX,
                            y: event.clientY,
                        });
                    }}
                    title="Notifications"
                    className="notification-button"
                >
                    <Fa.FaBell />
                    {notifications.filter(n => !n.read).length > 0 && (
                        <span className="notification-badge">{notifications.filter(n => !n.read).length}</span>
                    )}

                </button>

                <button
                    onClick={() => {
                        localStorage.setItem(
                            "gui.dashboard.show_user_list",
                            !guiVisibility.userList
                        );
                        updateGuiState("userList", !guiVisibility.userList);
                    }}
                    title="Afficher/Masquer la liste des utilisateurs"
                >
                    <Fa.FaUserGroup />
                </button>
            </div>
        </>
    );
};

export default HeaderButtons;
