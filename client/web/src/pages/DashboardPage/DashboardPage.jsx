import  { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import useSocketEvents from "../../hooks/useSocketEvents";
import DashboardPopups from "../../components/DashboardPopups/DashboardPopups";
import DashboardRight from "../../components/DashboardRight/DashboardRight";
import DashboardLeft from "../../components/DashboardLeft/DashboardLeft";
import WorkspaceModalManager from "../../components/DashboardModals/WorkspaceModalManager";
import DiscoverWorkspaces from "../../components/DashboardRight/DiscoverWorkspaces";

import { createWorkspaceInvitation } from "../../services/WorkspaceInvitations";
import { getPublicWorkspaces } from "../../services/Workspaces";
import { getBackground, getForeground } from "../../utils/colorUtils";

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
    const [publicWorkspaces, setPublicWorkspaces] = useState([]);
    const [workspaceName, setWorkspaceName] = useState("");
    const [workspaceDescription, setWorkspaceDescription] = useState("");
    const [workspaceIsPrivate, setWorkspaceIsPrivate] = useState(false);
    const [workspaceIdToSelect, setWorkspaceIdToSelect] = useState(null);
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
            manageRoles: false,

        },
    });
    const [popupVisibility, setPopupVisibility] = useState({
        profile: false,
        pinned: false,
        notifications: false,
        emojis: false,
        workspace: false,
        joinedNotification: false,
        channelInvite: false,
    });
    const [modalVisibility, setModalVisibility] = useState({
        workspace: false,
    });
    const [messages, setMessages] = useState([]);

    const [channelName, setChannelName] = useState("");
    const [channelDescription, setChannelDescription] = useState("");
    const [channelIsPrivate, setChannelIsPrivate] = useState(false);
    const [joinedUsername, setJoinedUsername] = useState("");
    const [workspaceUsers, setWorkspaceUsers] = useState([]);
    const [notifications, setNotifications] = useState(() => {
        const stored = localStorage.getItem("notifications");
        return stored ? JSON.parse(stored) : [];
    });
    const [channelNotificationPrefs, setChannelNotificationPrefs] = useState(() => {
        const saved = localStorage.getItem("channelNotificationPrefs");
        return saved ? JSON.parse(saved) : {};
    });

    const [channelToSelect, setChannelToSelect] = useState(null);

    const notificationSoundRef = useRef(null);  // useref= val qui persiste entre les renders
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



    // stocke les notifs en localstorag
    useEffect(() => {
        localStorage.setItem("notifications", JSON.stringify(notifications));
    }, [notifications]);

    //get les workspaces publics uniquement si l'utilisateur ouvre la vue discover
    useEffect(() => {
        if (guiVisibility.discoverWorkspaces) {
            getPublicWorkspaces()
                .then((data) => {
                    setPublicWorkspaces(data);
                })
                .catch((err) => {
                    console.error("Erreur chargement workspaces publics :", err);
                });
        }
    }, [guiVisibility.discoverWorkspaces]);

    // Si aucun workspace sélectionné mais des workspaces dispo => auto sélection du premier
    useEffect(() => {
        const workspaceArray = Object.values(workspaces);
        if (workspaceArray.length > 0 && !selectedWorkspace?.id) {
            setSelectedWorkspace(workspaceArray[0]);
        }
    }, [workspaces, selectedWorkspace?.id]);


    const handleJoinPublicWorkspace = (workspace) => {
        if (!workspace || !workspace.id || !user?.id)
            return;
        if (!workspaces[workspace.id]) { // met à jour le ws pour trigger le useEffect (ligne 87)
            // qui va mettre à jour la liste des membres du ws. La condition dit grossomodo si ya plus de workspace dans la liste
            // des ws public (dans discover, du coup ça veut dire qu'on a cliqué sur rejoindre) alors on met à jour le state
            setWorkspaceIdToSelect(workspace.id);
        }
        // Si le workspace est privé et que l'utilisateur n'est pas membre => on bloque
        const isAlreadyMember = !!workspaces[workspace.id];

        if (workspace.is_private && !isAlreadyMember) {
            alert("Ce workspace est privé. Utilisez un lien d'invitation.");
            return;
        }

        socket.emit("joinWorkspace", { workspace_id: workspace.id });
        updateGuiState("discoverWorkspaces", false);

    };


    // on recup l'user stocké en localstorage pi on le connecte via socket, ou redirige vers login
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (!storedUser || !storedUser.data) {
            navigate("/login", { state: { expired: true } });
            return;
        }

        setUser(storedUser.data);
        socket.emit("registerUser", storedUser.data.id);
    }, [navigate]);




    // kézako useCallback ? va faire en sorte que la fonction garde sa référence tant que ses dépendances changent pas
    // donc elle est pas recréée à chaque render (contrairement à une fonction normale dans un composant React)

    // pourquoi c’est utile ici ?
    // → parce que des useEffect peuvent redéclencher cette fonction plusieurs fois si sa référence change entre deux renders
    // → résultat : pushNotification pouvait envoyer 2 notifs au lieu d'une (genre "deux pour le prix d’une", pas ouf)

    // du coup, on stabilise pushNotification avec useCallback
    // ça évite les appels en double, les effets chelous et les comportements imprévus
    const pushNotification = useCallback((notif) => {
        if (notif.channelId && channelNotificationPrefs[notif.channelId] === false) return false;

        const alreadyExists = notifications.some(n =>
            n.type === notif.type &&
            n.workspaceId === notif.workspaceId &&
            n.channelId === notif.channelId &&
            !n.read
        );

        if (alreadyExists) return false;

        setNotifications(prev => [...prev, { ...notif, read: false }]);
        updatePopupState("notifications", true);

        return true; // ✅ ajoutée
    }, [notifications, channelNotificationPrefs]);




    // même délire pour handleNewPublicWorkspace
    // on évite de recréer la fonction à chaque render
    // sinon, elle est vue comme "nouvelle" et peut foutre le bazar dans les useEffect
const handleNewPublicWorkspace = useCallback((workspace) => {
  if (
    workspace.is_private ||
    workspaces[workspace.id] ||
    publicWorkspaces.some(w => w.id === workspace.id) // ✅ ← ceci évite le spam
  ) {
    return;
  }

  pushNotification({
    type: "newPublicWorkspace",
    message: `Un nouvel espace public a été créé : ${workspace.name}`,
    workspaceId: workspace.id,
  });

  notificationSoundRef.current.play().catch(err => {
    console.warn("Playback failed:", err);
  });

  setPublicWorkspaces(prev => [...prev, workspace]);
}, [workspaces, publicWorkspaces, pushNotification]);


    


    const updatePopupState = (key, value) => {
        setPopupVisibility((prev) => ({ ...prev, [key]: value }));
    };

    // récupère les workspaces du user,
    // sélectionne le 1er et le rejoint automatiquement
    useEffect(() => {
        if (!user || !user.id) return;

        socket.emit("getUserWorkspaces", { user_id: user.id });

        socket.once("userWorkspaces", (workspaceList) => {
            const newWorkspaces = {};
            workspaceList.forEach((workspace) => {
                newWorkspaces[workspace.id] = workspace;
            });

            setWorkspaces(newWorkspaces);

            if (workspaceList.length > 0) {
                const first = workspaceList[0];
                setSelectedWorkspace(first);

                socket.emit("joinWorkspace", { workspace_id: first.id });
            }
        });
    }, [user]);

    const updateGuiState = useCallback((key, value) => {
        setGuiVisibility((prev) => ({ ...prev, [key]: value }));
    }, []);

    const updateModalState = useCallback((key, value) => {
        setModalVisibility((prev) => ({ ...prev, [key]: value }));
    }, []);

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

    // Réception du workspace + channels après un join
    const onJoinSuccess = useCallback(({ workspace, channels = [] }) => {
        if (!workspace?.id) {
            console.error("Données workspace invalides :", workspace);
            return;
        }

        setWorkspaces(prev => ({
            ...prev,
            [workspace.id]: workspace,
        }));

        const channelMap = {};
        channels.forEach(channel => {
            channelMap[channel.id] = channel;
        });
        setChannels(channelMap);


        if (workspaceIdToSelect === workspace.id || !selectedWorkspace?.id) {
            setSelectedWorkspace(workspace);
            setWorkspaceIdToSelect(null); // reset
        }

        setSelectedWorkspace(workspace);

        //  En gros si il y a un channelToSelect (grossomodo si on a cliqué sur une notif qui nous fait switch de workspace)
        //  alors on le met dans selectedChannel car on suppose que si on est dans onJoinsuccess
        // c'est qu'on  vient de switch de workspace et donc le render est déjà fait (jrappel que si on change de workspace
        //le selectedChannel est reset.)
        if (channelToSelect) {
            const selected = Object.values(channelMap).find(c => c.id === channelToSelect);
            if (selected) {
                setSelectedChannel(selected);
                setChannelToSelect(null);
            }
        }

        setWorkspaceInvitation("");
        updateModalState("workspace", false);
        updateGuiState("workspaceModal", (prev) => ({
            ...prev,
            joinWorkspace: false,
        }));
    }, [channelToSelect, updateModalState, updateGuiState]);



    const switchToChannel = (workspaceId, channelId) => {
        const workspace = workspaces[workspaceId];
        if (!workspace) return;

        setSelectedWorkspace(workspace);
        setChannelToSelect(channelId);
    };

    // Gère le clic sur une notification
    const markNotificationAsRead = (index) => {
        setNotifications((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], read: true };
            return updated;
        });
    };

    const handleClickNotification = (index, notif) => {
        markNotificationAsRead(index);

        if (notif.type === "newPublicWorkspace") {
            updateGuiState("discoverWorkspaces", true);
            return;
        }
        const workspaceId = notif.workspaceId;
        const channelId = notif.channelId;

        switchToChannel(workspaceId, channelId);
    };

    useEffect(() => {
        // Dès qu’on change de workspace, on remet à zéro le canal sélectionné sinon ça va faire un bazar
        setSelectedChannel({});
    }, [selectedWorkspace?.id]);

    // Si un channel est en attente de sélection (channelToSelect),
    //  on tente de le sélectionner directement s’il existe déjà,
    // sinon on emit l'event joinChannel ce qui va trigger un useffect (ligne 134) qui va set le channel
    useEffect(() => {
        if (!selectedWorkspace?.id || !channelToSelect) return;

        const channel = Object.values(channels).find(c => c.id === channelToSelect);

        if (channel) {
            setSelectedChannel(channel);
            setChannelToSelect(null);
        } else {
            socket.emit("joinChannel", {
                channel_id: channelToSelect,
                workspace_id: selectedWorkspace.id
            });
        }
    }, [selectedWorkspace?.id, channelToSelect, channels]);

    // Sélectionne automatiquement le premier canal du workspace courant si aucun canal n’est encore sélectionné
    useEffect(() => {
        if (!selectedWorkspace?.id) return;

        const channelList = Object.values(channels).filter(c => c.workspace_id === selectedWorkspace.id);

        if (channelList.length > 0 && !selectedChannel?.id) {
            setSelectedChannel(channelList[0]);
        }
    }, [selectedWorkspace?.id, channels, selectedChannel?.id]);



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

    const handleRemoveNotification = (indexToRemove) => {
        setNotifications((prev) => {
            const updated = prev.filter((_, i) => i !== indexToRemove);
            localStorage.setItem("notifications", JSON.stringify(updated));
            return updated;
        });
    };

    const handleJoinWorkspace = (event) => {
        event.preventDefault();

        socket.emit("joinWorkspaceWithInvitation", {
            token: workspaceInvitation,
            user_id: user.id,
            username: user.username,
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

    useSocketEvents({
        workspaces,
        socket,
        selectedWorkspace,
        setWorkspaces,
        setSelectedWorkspace,
        selectedChannel,
        setChannels,
        setSelectedChannel,
        setWorkspaceUsers,
        pushNotification,
        setJoinedUsername,
        updatePopupState,
        onJoinSuccess,
        setChannelToSelect,
        user,
        setMessages,
        notificationSoundRef,
        setConnectedUsers,
        handleNewPublicWorkspace,
    });


    const currentUserRoleId = workspaceUsers.find(u => u.user_id === user.id)?.role_id;




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
                selectedWorkspace={selectedWorkspace}
                currentUserRoleId={currentUserRoleId}
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
                selectedWorkspaceId={selectedWorkspace?.id}
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
                notifications={notifications}
                handleRemoveNotification={handleRemoveNotification}
                handleClickNotification={handleClickNotification}
                onLogout={() => {
                    socket.disconnect();
                    localStorage.removeItem("user");
                    navigate("/login");
                }}
            />

            <DashboardLeft
                workspaces={workspaces}
                publicWorkspaces={publicWorkspaces}
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
                handleJoinPublicWorkspace={handleJoinPublicWorkspace}
            />

            {selectedWorkspace.id && !guiVisibility.discoverWorkspaces && (
                <DashboardRight
                    currentUserRoleId={currentUserRoleId}
                    messages={messages}
                    setMessages={setMessages}
                    notificationSoundRef={notificationSoundRef}
                    pushNotification={pushNotification}
                    channels={channels}
                    setSelectedChannel={setSelectedChannel}
                    selectedWorkspace={selectedWorkspace}
                    selectedChannel={selectedChannel}
                    user={user}
                    connectedUsers={connectedUsers}
                    workspaceUsers={workspaceUsers}
                    guiVisibility={guiVisibility}
                    updateGuiState={updateGuiState}
                    hideAllPopup={hideAllPopup}
                    updatePopupState={updatePopupState}
                    setMousePosition={setMousePosition}
                    notifications={notifications}
                    channelNotificationPrefs={channelNotificationPrefs}
                    setChannelNotificationPrefs={setChannelNotificationPrefs}


                />
            )}
            {!selectedWorkspace.id && !guiVisibility.discoverWorkspaces && (
                <div className="dashboard-right">
                    <p>Aucun espace de travail sélectionné</p>
                </div>
            )}
            {guiVisibility.discoverWorkspaces && (
                <DiscoverWorkspaces
                    publicWorkspaces={publicWorkspaces}
                    workspaces={workspaces}
                    onJoinWorkspace={handleJoinPublicWorkspace}
                    onClose={() => updateGuiState("discoverWorkspaces", false)}
                    toggleLeftPanel={() =>
                        updateGuiState("leftPanel", !guiVisibility.leftPanel)
                    }
                />
            )}
            <audio ref={notificationSoundRef} src="/sounds/notification.mp3" preload="auto" />
        </div>
    );
};

export default DashboardPage;
