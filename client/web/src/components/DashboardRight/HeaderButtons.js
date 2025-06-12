import * as Fa from "react-icons/fa";
import "./DashboardRight.css"

const HeaderButtons = ({
    guiVisibility,
    updateGuiState,
    hideAllPopup,
    updatePopupState,
    setMousePosition,
    notifications,
    selectedChannel,
    channelNotificationPrefs,
    toggleChannelNotifications
}) => {

    return (
        <>
            <div className="dashboard-right-header-buttons">
                <button
                    onClick={() => updateGuiState("leftPanel", !guiVisibility.leftPanel)}
                    title="Afficher/Masquer le panneau de gauche"
                >
                    <Fa.FaBars />
                </button>
            </div>
            <h2 className="channel-title">
                {selectedChannel?.name
                    ? `#${selectedChannel.name}`
                    : "Aucun canal sélectionné"}
            </h2>
            <div className="dashboard-right-header-buttons">
                <button
                    onClick={(event) => {
                        event.stopPropagation();
                        hideAllPopup();
                        updatePopupState("pinned", true);
                        setMousePosition({ x: event.clientX, y: event.clientY });
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
                        setMousePosition({ x: event.clientX, y: event.clientY });
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
                        localStorage.setItem("gui.dashboard.show_user_list", !guiVisibility.userList);
                        updateGuiState("userList", !guiVisibility.userList);
                    }}
                    title="Afficher/Masquer la liste des utilisateurs"
                >
                    <Fa.FaUsers />
                </button>

                {selectedChannel?.id && (
                    <button
                        onClick={() => toggleChannelNotifications(selectedChannel.id)}
                        title={
                            channelNotificationPrefs[selectedChannel.id] === false
                                ? "Activer le son pour ce canal"
                                : "Couper le son pour ce canal"
                        }
                    >
                        {channelNotificationPrefs[selectedChannel.id] === false
                            ? <Fa.FaVolumeMute />
                            : <Fa.FaVolumeUp />}
                    </button>
                )}
            </div>
        </>
    );
};

export default HeaderButtons;
