import { useEffect, useState, useRef, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import useSocketEvents from '../../hooks/useSocketEvents';
import DashboardPopups from '../../components/DashboardPopups/DashboardPopups';
import DashboardRight from '../../components/DashboardRight/DashboardRight';
import DashboardLeft from '../../components/DashboardLeft/DashboardLeft';
import WorkspaceModalManager from '../../components/DashboardModals/WorkspaceModalManager';
import DiscoverWorkspaces from '../../components/DashboardRight/DiscoverWorkspaces';
import { createWorkspaceInvitation } from '../../../services/WorkspaceInvitations';
import { getPublicWorkspaces } from '../../../services/Workspaces';
import { getBackground, getForeground } from '../../../utils/colorUtils';
import socket from '../../socket';
import styles from './DashboardPageStyles';

const DashboardPage = () => {
  const [theme, setTheme] = useState('light');
  const [mousePosition, setMousePosition] = useState({});
  const [selectedWorkspace, setSelectedWorkspace] = useState({});
  const [selectedChannel, setSelectedChannel] = useState({});
  const [channelNotificationPrefs, setChannelNotificationPrefs] = useState({});
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [user, setUser] = useState({});
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [workspaces, setWorkspaces] = useState({});
  const [channels, setChannels] = useState({});
  const [guiVisibility, setGuiVisibility] = useState({
    discoverWorkspaces: false,
    leftPanel: true,
    userList: false,
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
    joinedNotification: false,
    emojis: false,
    workspace: false,
  });
  const [notifications, setNotifications] = useState([]);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDescription, setWorkspaceDescription] = useState('');
  const [workspaceIsPrivate, setWorkspaceIsPrivate] = useState(false);
  const [workspaceInvitation, setWorkspaceInvitation] = useState('');
  const [channelName, setChannelName] = useState('');
  const [channelIsPrivate, setChannelIsPrivate] = useState(false);
  const [messages, setMessages] = useState([]);
  const [publicWorkspaces, setPublicWorkspaces] = useState([]);
  const [joinedUsername, setJoinedUsername] = useState('');

  const updateGuiState = useCallback((key, value) => {
    setGuiVisibility((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateModalState = useCallback((key, value) => {
    setGuiVisibility((prev) => ({
      ...prev,
      workspaceModal: {
        ...prev.workspaceModal,
        [key]: value,
      },
    }));
  }, []);

  const updatePopupState = useCallback((key, value) => {
    setPopupVisibility((prev) => ({ ...prev, [key]: value }));
  }, []);

  const hideAllPopup = () => {
    setPopupVisibility({
      profile: false,
      pinned: false,
      notifications: false,
      joinedNotification: false,
      emojis: false,
      workspace: false,
    });
  };

  const handleGenerateInvitation = async () => {
    if (!selectedWorkspace?.id) return;
    const response = await createWorkspaceInvitation({
      workspace_id: selectedWorkspace.id,
    });
    if (response?.invitation_token) {
      setWorkspaceInvitation(response.invitation_token);
      updateModalState("joinWorkspace", true);
    }
  };

  useEffect(() => {
    getPublicWorkspaces().then((res) => {
      if (res?.result) setPublicWorkspaces(res.result);
    });
  }, []);

  useSocketEvents({
    socket,
    user,
    selectedWorkspace,
    selectedChannel,
    setMessages,
    setConnectedUsers,
    setJoinedUsername,
    updatePopupState,
    setNotifications,
    setChannelNotificationPrefs,
  });

  return (
    <View style={styles.dashboardContainer}>
      <DashboardLeft
        user={user}
        selectedWorkspace={selectedWorkspace}
        workspaces={workspaces}
        setSelectedWorkspace={setSelectedWorkspace}
        updateGuiState={updateGuiState}
        getBackground={getBackground}
        getForeground={getForeground}
        guiVisibility={guiVisibility}
        publicWorkspaces={publicWorkspaces}
        handleJoinPublicWorkspace={() => {}}
        channels={channels}
        selectedChannel={selectedChannel}
        setSelectedChannel={setSelectedChannel}
        updateModalState={updateModalState}
        hideAllPopup={hideAllPopup}
        updatePopupState={updatePopupState}
        setMousePosition={setMousePosition}
      />

      <DashboardRight
        selectedWorkspace={selectedWorkspace}
        selectedChannel={selectedChannel}
        user={user}
        guiVisibility={guiVisibility}
        updateGuiState={updateGuiState}
        hideAllPopup={hideAllPopup}
        updatePopupState={updatePopupState}
        setMousePosition={setMousePosition}
        connectedUsers={connectedUsers}
        hasNoChannels={Object.keys(channels).length === 0}
        messages={messages}
        notifications={notifications}
        channelNotificationPrefs={channelNotificationPrefs}
        toggleChannelNotifications={() => {}}
        selectedMessageId={selectedMessageId}
        setSelectedMessageId={setSelectedMessageId}
      />

      <DashboardPopups
        visibility={popupVisibility}
        theme={theme}
        mousePosition={mousePosition}
        joinedUsername={joinedUsername}
        onLogout={() => {}}
        notifications={notifications}
        handleClickNotification={() => {}}
        handleRemoveNotification={() => {}}
      />

      <WorkspaceModalManager
        display={popupVisibility.workspace}
        theme={theme}
        guiVisibility={guiVisibility.workspaceModal}
        updateGuiState={updateGuiState}
        updateModalState={updateModalState}
        handleCreateWorkspace={() => {}}
        handleJoinWorkspace={() => {}}
        handleCreateChannel={() => {}}
        handleGenerateInvitation={handleGenerateInvitation}
        workspaceName={workspaceName}
        workspaceDescription={workspaceDescription}
        workspaceIsPrivate={workspaceIsPrivate}
        workspaceInvitation={workspaceInvitation}
        channelName={channelName}
        channelIsPrivate={channelIsPrivate}
        setWorkspaceName={setWorkspaceName}
        setWorkspaceDescription={setWorkspaceDescription}
        setWorkspaceIsPrivate={setWorkspaceIsPrivate}
        setWorkspaceInvitation={setWorkspaceInvitation}
        setChannelName={setChannelName}
        setChannelIsPrivate={setChannelIsPrivate}
        selectedWorkspaceId={selectedWorkspace?.id}
        currentUserRoleId={user?.role_id}
        selectedWorkspace={selectedWorkspace}
      />

      {guiVisibility.discoverWorkspaces && (
        <DiscoverWorkspaces
          publicWorkspaces={publicWorkspaces}
          workspaces={workspaces}
          onJoinWorkspace={() => {}}
          onClose={() => updateGuiState("discoverWorkspaces", false)}
          toggleLeftPanel={() => updateGuiState("leftPanel", !guiVisibility.leftPanel)}
        />
      )}
    </View>
  );
};

export default DashboardPage;