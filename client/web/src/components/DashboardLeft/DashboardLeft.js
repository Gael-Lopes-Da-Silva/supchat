import React, { useEffect } from 'react';
import * as Fa from "react-icons/fa6";
import WorkspaceButtons from "./WorkspaceButtons";
import WorkspaceList from "./WorkspaceList";
import ChannelList from "./ChannelList";
import { useNavigate } from "react-router-dom";
import socket from '../../socket';

const DashboardLeft = ({
    workspaces,
    selectedWorkspace,
    channels,
    selectedChannel,
    user,
    guiVisibility,
    updateGuiState,
    setSelectedWorkspace,
    setChannels,
    setSelectedChannel,
    hideAllPopup,
    updatePopupState,
    updateModalState,
    setMousePosition,
    getBackground,
    getForeground,
    publicWorkspaces,
    handleJoinPublicWorkspace,
}) => {
    const navigate = useNavigate();


    useEffect(() => {
        if (!selectedWorkspace.id) return;

        socket.emit('joinWorkspace', selectedWorkspace.id);


        const handleChannelCreated = (newChannel) => {

            setChannels((prevChannels) => ({
                ...prevChannels,
                [newChannel.id]: newChannel,
            }));
        };

        socket.on("channelCreated", handleChannelCreated);

        return () => {
            socket.off("channelCreated", handleChannelCreated);
        };
    }, [selectedWorkspace.id]);



    return (
        <div className="dashboard-left" style={{ display: !guiVisibility.leftPanel && "none" }}>
            <div className="dashboard-left-workspaces">
                <WorkspaceList
                    workspaces={workspaces}
                    publicWorkspaces={publicWorkspaces}
                    selectedWorkspace={selectedWorkspace}
                    updateGuiState={updateGuiState}
                    setSelectedWorkspace={setSelectedWorkspace}
                    getBackground={getBackground}
                    getForeground={getForeground}
                    handleJoinPublicWorkspace={handleJoinPublicWorkspace}
                />

                <WorkspaceButtons
                    updateGuiState={updateGuiState}
                    updateModalState={updateModalState}
                />
            </div>
            <div className="dashboard-left-content">
                {selectedWorkspace.id && (
                    <header>
                        <div
                            onClick={(event) => {
                                event.stopPropagation();
                                hideAllPopup();
                                updatePopupState("workspace", true);
                                setMousePosition({
                                    x: event.clientX,
                                    y: event.clientY,
                                });
                            }}
                        >
                            <p>{selectedWorkspace.name}</p>
                            <Fa.FaChevronDown />
                        </div>
                    </header>
                )}
                <main>
                    {selectedWorkspace.id && (
                        <ChannelList
                            channels={channels}
                            setSelectedChannel={setSelectedChannel}
                            selectedChannel={selectedChannel}
                            getBackground={getBackground}
                            getForeground={getForeground}
                        />
                    )}
                </main>
                <footer>
                    <div
                        onClick={(event) => {
                            event.stopPropagation();
                            hideAllPopup();
                            updatePopupState("profile", true);
                            setMousePosition({
                                x: event.clientX,
                                y: event.clientY,
                            });
                        }}
                        className="dashboard-left-footer-profile"
                        title="Menu de profil"
                    >
                        <div
                            style={{
                                background: getBackground(user && user.username),
                                color: getForeground(user && user.username),
                            }}
                        >
                            {user && user.username[0].toUpperCase()}
                        </div>
                        <p>{user && user.username}</p>
                    </div>
                    <div className="dashboard-left-footer-buttons">
                        <button
                            onClick={() => {
                                navigate("/settings");
                            }}
                            title="Paramètres utilisateur"
                        >
                            <Fa.FaGear />
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default DashboardLeft;
