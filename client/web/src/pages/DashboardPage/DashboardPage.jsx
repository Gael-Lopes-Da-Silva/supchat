import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import * as Fa from "react-icons/fa6";
import DashboardPopups from "../../components/DashboardPopups/DashboardPopups";
import DashboardRight from "../../components/DashboardRight/DashboardRight";
import DashboardLeft from "../../components/DashboardLeft/DashboardLeft";
import WorkspaceModalManager from "../../components/DashboardModals/WorkspaceModalManager";
import {
    readChannel
} from "../../services/Channels";
import { createWorkspaceInvitation } from "../../services/WorkspaceInvitations";
import "./DashboardPage.css";
import socket from '../../socket';


const DashboardPage = () => {
    const [theme] = useState(localStorage.getItem("gui.theme") ?? "light");
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [user, setUser] = useState("");
    const [workspaces, setWorkspaces] = useState({});
    const [selectedWorkspace, setSelectedWorkspace] = useState({});
    const [channels, setChannels] = useState({});
    const [selectedChannel, setSelectedChannel] = useState({});
    const [workspaceName, setWorkspaceName] = useState("");
    const [workspaceDescription, setWorkspaceDescription] = useState("");
    const [workspaceIsPrivate, setWorkspaceIsPrivate] = useState(false);
    const [workspaceInvitation, setWorkspaceInvitation] = useState("");
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [guiVisibility, setGuiVisibility] = useState({
        userList: false,
        leftPanel: true,
        discoverWorkspaces: false,
        workspaceModal: {
            createWorkspace: false,
            joinWorkspace: false,
            createChannel: false,
        },
    });
    const [popupVisibility, setPopupVisibility] = useState({
        profile: false,
        pinned: false,
        notifications: false,
        emojis: false,
        workspace: false,
        joinedNotification: false,
    });
    const [modalVisibility, setModalVisibility] = useState({
        workspace: false,
    });

    const [channelName, setChannelName] = useState("");
    const [channelDescription, setChannelDescription] = useState("");
    const [channelIsPrivate, setChannelIsPrivate] = useState(false);
    const [joinedUsername, setJoinedUsername] = useState("");

    const dashboardContainerRef = useRef(null);
    const modalRefs = {
        workspace: useRef(null),
    };
    const popupRefs = {
        profile: useRef(null),
        pinned: useRef(null),
        notifications: useRef(null),
        emojis: useRef(null),
        workspace: useRef(null),
        joinedNotification: useRef(null),

    };

    const navigate = useNavigate();


    useEffect(() => {
        const channelArray = Object.values(channels);
        if (channelArray.length > 0) {
            setSelectedChannel(channelArray[0]);
        }
    }, [channels]);

    useEffect(() => {
        const workspaceArray = Object.values(workspaces);
        if (workspaceArray.length > 0 && !selectedWorkspace.id) {
            setSelectedWorkspace(workspaceArray[0]);
        }
    }, [workspaces, selectedWorkspace]);


    useEffect(() => {
        socket.on("connectedUsers", (users) => {
            setConnectedUsers(users);
        });

        return () => {
            socket.off("connectedUsers");
        };
    }, []);


    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (!storedUser || !storedUser.data) {
            navigate("/login", { state: { expired: true } });
            return;
        }

        setUser(storedUser.data);


        socket.emit("registerUser", storedUser.data.id);
    }, [navigate]);


    useEffect(() => {
        if (selectedWorkspace.id) {
            readChannel({ workspace_id: selectedWorkspace.id })
                .then((data) => {
                    const newChannels = {};
                    data.result.forEach((channel) => {
                        newChannels[channel.id] = channel;
                    });
                    setChannels(newChannels);
                    if (data.result.length > 0) {
                        setSelectedChannel(data.result[0]);
                    }
                })
                .catch((error) => {
                    console.error('Error reading channels:', error);
                });
        }
    }, [selectedWorkspace]);

    useEffect(() => {
        socket.on("channelCreated", (newChannel) => {

            if (selectedWorkspace.id === newChannel.workspace_id) {
                setChannels((prev) => ({
                    ...prev,
                    [newChannel.id]: newChannel
                }));
            }
        });

        return () => {
            socket.off("channelCreated");
        };
    }, [selectedWorkspace]);


    socket.on("workspaceCreated", (newWorkspace) => {
        setWorkspaces((prev) => {
            const updated = {
                ...prev,
                [newWorkspace.id]: newWorkspace,
            };

            if (!selectedWorkspace.id) {
                setSelectedWorkspace(newWorkspace);
            }

            return updated;
        });
    });


    useEffect(() => {
        socket.on("workspaceUserJoined", ({ workspace_id, username }) => {

            setJoinedUsername(username);
            setPopupVisibility((prev) => ({ ...prev, joinedNotification: true }));

            setTimeout(() => {
                setPopupVisibility((prev) => ({ ...prev, joinedNotification: false }));
            }, 3000);
        });

        return () => {
            socket.off("workspaceUserJoined");
        };
    }, []);



    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (!storedUser || !storedUser.data) {
            navigate("/login", { state: { expired: true } });
            return;
        }

        setUser(storedUser.data);
    }, [navigate]);


    useEffect(() => {
        if (!user || !user.id) return;

        socket.emit("getUserWorkspaces", { user_id: user.id });

        socket.once("userWorkspaces", (workspaceList) => {
            const newWorkspaces = {};
            workspaceList.forEach((workspace) => {
                newWorkspaces[workspace.id] = workspace;
            });
            setWorkspaces(newWorkspaces);


            if (!selectedWorkspace.id && workspaceList.length > 0) {
                setSelectedWorkspace(workspaceList[0]);
            }
        });

        const showUserList = localStorage.getItem("gui.dashboard.show_user_list");
        if (showUserList !== null) updateGuiState("userList", showUserList === "true");
    }, [user]);


    const updateGuiState = (key, value) => {
        setGuiVisibility((prev) => ({ ...prev, [key]: value }));
    };

    const updatePopupState = (key, value) => {
        setPopupVisibility((prev) => ({ ...prev, [key]: value }));
    };

    const updateModalState = (key, value) => {
        setModalVisibility((prev) => ({ ...prev, [key]: value }));
    };

    const hideAllPopup = () => {
        updatePopupState("profile", false);
        updatePopupState("pinned", false);
        updatePopupState("notifications", false);
        updatePopupState("emojis", false);
        updatePopupState("workspace", false);
    };

    const hideAllModal = () => {
        updateModalState("workspace", false);
    };

    const handleCreateWorkspace = (event) => {
        event.preventDefault();

        socket.emit("createWorkspace", {
            name: workspaceName,
            description: workspaceDescription,
            is_private: workspaceIsPrivate,
            user_id: user.id,
        });


        setWorkspaceName("");
        setWorkspaceDescription("");
        setWorkspaceIsPrivate(false);
        hideAllModal();
    };




    const handleGenerateInvitation = async () => {
        if (!selectedWorkspace.id) {
            console.error("No workspace selected");
            return;
        }

        try {
            const response = await createWorkspaceInvitation({
                workspace_id: selectedWorkspace.id,
                user_id: user.id,
            });

            if (response.result && response.result.result && response.result.result.token) {
                alert(`Invitation link: ${response.result.result.token}`);
            } else {
                console.error("Token not found in response:", response);
            }
        } catch (error) {
            console.error("Error generating invitation:", error);
        }
    };


    const handleJoinWorkspace = (event) => {
        event.preventDefault();

        socket.emit("joinWorkspaceWithInvitation", {
            token: workspaceInvitation,
            user_id: user.id,
            username: user.username,
        });

        socket.once("joinWorkspaceSuccess", (workspaceData) => {
            if (!workspaceData || !workspaceData.id) {
                console.error("Données workspace invalides", workspaceData);
                return;
            }


            setWorkspaces((prev) => ({
                ...prev,
                [workspaceData.id]: workspaceData,
            }));

            setSelectedWorkspace(workspaceData);
            setWorkspaceInvitation("");
            hideAllModal();
        });

        socket.once("joinWorkspaceError", (error) => {
            console.error("Erreur socket joinWorkspace:", error);
        });
    };


    const handleCreateChannel = (event) => {
        event.preventDefault();


        socket.emit("createChannel", {
            name: channelName,
            is_private: channelIsPrivate,
            workspace_id: selectedWorkspace.id,
            user_id: user.id
        });



        setChannelName("");
        setChannelDescription("");
        setChannelIsPrivate(false);
        hideAllModal();
    };


    const getBackground = (text) => {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = (hash << 5) - hash + text.charCodeAt(i);
        }

        return `#${((hash >> 24) & 0xff).toString(16).padStart(2, "0")}${(
            (hash >> 16) &
            0xff
        )
            .toString(16)
            .padStart(2, "0")}${((hash >> 8) & 0xff).toString(16).padStart(2, "0")}`;
    };

    const getForeground = (text) => {
        const background = getBackground(text);
        const color = background.replace("#", "");

        const r = parseInt(color.substring(0, 2), 16) / 255;
        const g = parseInt(color.substring(2, 4), 16) / 255;
        const b = parseInt(color.substring(4, 6), 16) / 255;

        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        return luminance > 0.5 ? "#000000" : "#FFFFFF";
    };

    return (
        <div ref={dashboardContainerRef} onClick={(event) => {
            const isOutsideDashboard = dashboardContainerRef.current && !dashboardContainerRef.current.contains(event.target);

            const isOutsideModal = Object.values(modalRefs).every(
                (modalRef) => !modalRef?.current || !modalRef.current.contains(event.target)
            );

            const isOutsidePopups = Object.values(popupRefs).every(
                (popupRef) => !popupRef?.current || !popupRef.current.contains(event.target)
            );

            if (!isOutsideDashboard && isOutsideModal && isOutsidePopups) {
                hideAllPopup();
                hideAllModal();
            }
        }} className={`dashboard-container ${theme}`}>

            <WorkspaceModalManager
                modalRef={modalRefs.workspace}
                display={modalVisibility.workspace}
                theme={theme}
                guiVisibility={guiVisibility.workspaceModal}
                updateGuiState={updateGuiState}
                updateModalState={updateModalState}
                handleCreateWorkspace={handleCreateWorkspace}
                handleJoinWorkspace={handleJoinWorkspace}
                handleCreateChannel={handleCreateChannel}
                handleGenerateInvitation={handleGenerateInvitation}
                workspaceName={workspaceName}
                workspaceDescription={workspaceDescription}
                workspaceIsPrivate={workspaceIsPrivate}
                workspaceInvitation={workspaceInvitation}
                channelName={channelName}
                channelDescription={channelDescription}
                channelIsPrivate={channelIsPrivate}
                setWorkspaceName={setWorkspaceName}
                setWorkspaceDescription={setWorkspaceDescription}
                setWorkspaceIsPrivate={setWorkspaceIsPrivate}
                setWorkspaceInvitation={setWorkspaceInvitation}
                setChannelName={setChannelName}
                setChannelDescription={setChannelDescription}
                setChannelIsPrivate={setChannelIsPrivate}
            />

            <DashboardPopups
                refs={popupRefs}
                visibility={popupVisibility}
                theme={theme}
                mousePosition={mousePosition}
                joinedUsername={joinedUsername}
                onLogout={() => {
                    localStorage.removeItem("user");
                    navigate("/login");
                }}
            />


            <DashboardLeft
                key={Object.keys(workspaces).length}
                workspaces={workspaces}
                selectedWorkspace={selectedWorkspace}
                channels={channels}
                selectedChannel={selectedChannel}
                user={user}
                guiVisibility={guiVisibility}
                updateGuiState={updateGuiState}
                setSelectedWorkspace={setSelectedWorkspace}
                setChannels={setChannels}
                setSelectedChannel={setSelectedChannel}
                hideAllPopup={hideAllPopup}
                updatePopupState={updatePopupState}
                updateModalState={updateModalState}
                setMousePosition={setMousePosition}
                getBackground={getBackground}
                getForeground={getForeground}
            />


            {selectedWorkspace.id && !guiVisibility.discoverWorkspaces && (
                <DashboardRight
                    selectedWorkspace={selectedWorkspace}
                    selectedChannel={selectedChannel}
                    user={user}
                    connectedUsers={connectedUsers}
                    guiVisibility={guiVisibility}
                    updateGuiState={updateGuiState}
                    hideAllPopup={hideAllPopup}
                    updatePopupState={updatePopupState}
                    setMousePosition={setMousePosition}
                />
            )}
            {!selectedWorkspace.id && !guiVisibility.discoverWorkspaces && (
                <div className="dashboard-right">
                    <p>Aucun espace de travail sélectionné</p>
                </div>
            )}
            {guiVisibility.discoverWorkspaces && (
                <div className="dashboard-right">
                    <div className="dashboard-right-content">
                        <header>
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
                            <p>Découvrir de nouveaux espaces de travail</p>
                            <div className="dashboard-right-header-buttons">
                                <button
                                    onClick={() => {
                                        updateGuiState("discoverWorkspaces", false);
                                    }}
                                    title="Fermer"
                                >
                                    <Fa.FaXmark />
                                </button>
                            </div>
                        </header>
                        <main></main>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
