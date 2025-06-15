import { useEffect, useState, useCallback, useRef } from 'react';
import { View, SafeAreaView, StatusBar, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';
import * as Audio from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Reanimated, {
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import { FontAwesome6 } from '@expo/vector-icons';

import DashboardLeft from '../../components/DashboardLeft/DashboardLeft';
import WorkspaceModalManager from "../../components/DashboardModals/WorkspaceModalManager";
import DashboardRight from '../../components/DashboardRight/DashboardRight';
import useSocketEvents from '../../hooks/useSocketEvents';
import { createWorkspaceInvitation } from '../../../services/WorkspaceInvitations';
import { getPublicWorkspaces } from '../../../services/Workspaces';
import { getBackground, getForeground } from '../../../utils/colorUtils';
import socket from '../../socket';
import styles from './DashboardScreenStyles';
import DiscoverWorkspaces from '../../components/DashboardRight/DiscoverWorkspaces';

const API_URL = Constants.expoConfig.extra.apiUrl;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const EDGE_WIDTH = 20;
const SWIPE_THRESHOLD = 50;

const DashboardPage = () => {
  const [theme] = useState('light');
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [user, setUser] = useState('');
  const [workspaces, setWorkspaces] = useState({});
  const [selectedWorkspace, setSelectedWorkspace] = useState({});
  const [channels, setChannels] = useState({});
  const [selectedChannel, setSelectedChannel] = useState({});
  const [publicWorkspaces, setPublicWorkspaces] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [workspaceUsers, setWorkspaceUsers] = useState([]);
  const [channelNotificationPrefs, setChannelNotificationPrefs] = useState({});
  const [workspaceIdToSelect, setWorkspaceIdToSelect] = useState(null);
  const [channelToSelect, setChannelToSelect] = useState(null);
  const [joinedUsername, setJoinedUsername] = useState('');
  const [guiVisibility, setGuiVisibility] = useState({
    leftPanel: false,
    userList: false,
    discoverWorkspaces: false,
    workspaceModal: {
      createWorkspace: false,
      joinWorkspace: false,
      createChannel: false,
      manageRoles: false,
    },
  });

  const notificationSound = useRef(null);
  const router = useRouter();
  const [modalVisibility, setModalVisibility] = useState({
    workspace: false,
  });
  const modalRefs = {
    workspace: useRef(null),
  };

  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [workspaceIsPrivate, setWorkspaceIsPrivate] = useState(false);
  const [workspaceInvitation, setWorkspaceInvitation] = useState("");
  const [channelName, setChannelName] = useState("");
  const [channelIsPrivate, setChannelIsPrivate] = useState(false);

  const updateModalState = useCallback((key, value) => {
    setModalVisibility((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../assets/sounds/notification.mp3')
      );
      notificationSound.current = sound;
    };
    loadSound();
    return () => {
      if (notificationSound.current) {
        notificationSound.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const stored = await AsyncStorage.getItem('notifications');
        if (stored) setNotifications(JSON.parse(stored));

        const prefs = await AsyncStorage.getItem('channelNotificationPrefs');
        if (prefs) setChannelNotificationPrefs(JSON.parse(prefs));
      } catch (error) {
        console.error('Erreur chargement notifications:', error);
      }
    };
    loadNotifications();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = JSON.parse(await AsyncStorage.getItem('user'));
        if (!storedUser?.data) {
          router.replace('/screens/LoginScreen/LoginScreen');
          return;
        }
        setUser(storedUser.data);
        socket.emit('registerUser', storedUser.data.id);
        const status = await AsyncStorage.getItem('user.status') || 'online';
        socket.emit('userStatusUpdate', { user_id: storedUser.data.id, status });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Erreur de chargement utilisateur',
          text2: error.message,
        });
        router.replace('/screens/LoginScreen/LoginScreen');
      }
    };
    loadUser();
  }, [router]);

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

  useEffect(() => {
    if (!user?.id) return;

    socket.emit('getUserWorkspaces', { user_id: user.id });

    socket.once('userWorkspaces', (workspaceList) => {
      const newWorkspaces = {};
      workspaceList.forEach((workspace) => {
        newWorkspaces[workspace.id] = workspace;
      });

      setWorkspaces(newWorkspaces);

      if (workspaceList.length > 0) {
        const first = workspaceList[0];
        setSelectedWorkspace(first);
        socket.emit('joinWorkspace', { workspace_id: first.id });
      } else {

        setGuiVisibility(prev => ({
          ...prev,
          discoverWorkspaces: true,
        }));
      }
    });
  }, [user]);

  useEffect(() => {
    const workspaceArray = Object.values(workspaces);
    if (workspaceArray.length > 0 && !selectedWorkspace?.id) {
      setSelectedWorkspace(workspaceArray[0]);
    }
  }, [workspaces, selectedWorkspace?.id]);

  useEffect(() => {
    if (selectedWorkspace?.id) {
      socket.emit('joinWorkspace', { workspace_id: selectedWorkspace.id }, (response) => {
        if (response?.channels) {
          const channelMap = {};
          response.channels.forEach(channel => {
            channelMap[channel.id] = channel;
          });
          setChannels(channelMap);

          const workspaceChannels = Object.values(channelMap).filter(
            channel => channel.workspace_id === selectedWorkspace.id
          );
          if (workspaceChannels.length > 0) {
            setSelectedChannel(workspaceChannels[0]);
          } else {
            setSelectedChannel({});
          }
        }
      });
    }
  }, [selectedWorkspace?.id]);

  useEffect(() => {
    setSelectedChannel({});
  }, [selectedWorkspace?.id]);

  useEffect(() => {
    if (!selectedWorkspace?.id) return;

    const channelList = Object.values(channels).filter(
      (c) => c.workspace_id === selectedWorkspace.id
    );

    if (channelList.length > 0 && !selectedChannel?.id) {
      setSelectedChannel(channelList[0]);
    }
  }, [selectedWorkspace?.id, channels, selectedChannel?.id]);

  const pushNotification = useCallback(
    (notif) => {
      if (notif.channelId && channelNotificationPrefs[notif.channelId] === false) {
        return false;
      }

      const alreadyExists = notifications.some(
        (n) =>
          n.type === notif.type &&
          n.workspaceId === notif.workspaceId &&
          n.channelId === notif.channelId &&
          !n.read
      );

      if (alreadyExists) return false;

      setNotifications((prev) => [...prev, { ...notif, read: false }]);

      if (notificationSound.current) {
        notificationSound.current.replayAsync().catch(console.error);
      }

      return true;
    },
    [notifications, channelNotificationPrefs]
  );

  const handleNewPublicWorkspace = useCallback(
    (workspace) => {
      if (
        workspace.is_private ||
        workspaces[workspace.id] ||
        publicWorkspaces.some((w) => w.id === workspace.id)
      ) {
        return;
      }

      pushNotification({
        type: 'newPublicWorkspace',
        message: `Un nouvel espace public a été créé : ${workspace.name}`,
        workspaceId: workspace.id,
      });

      setPublicWorkspaces((prev) => [...prev, workspace]);
    },
    [workspaces, publicWorkspaces, pushNotification]
  );

  const handleJoinPublicWorkspace = workspace => {
    if (!workspace?.id || !user?.id) return;

    const isAlreadyMember = !!workspaces[workspace.id];
    if (workspace.is_private && !isAlreadyMember) {
      Toast.show({
        type: 'error',
        text1: 'Workspace privé',
        text2: 'Utilisez un lien d\'invitation',
      });
      return;
    }

    if (!workspaces[workspace.id]) {
      setWorkspaceIdToSelect(workspace.id);
    }

    socket.emit('joinWorkspace', { workspace_id: workspace.id });
    setGuiVisibility(prev => ({ ...prev, discoverWorkspaces: false }));
  };

  const updateGuiState = (key, value) => {
    setGuiVisibility(prev => ({ ...prev, [key]: value }));
  };

  const hideAllPopup = () => {
    setGuiVisibility(prev => ({
      ...prev,
    }));
  };

  const onJoinSuccess = useCallback(
    ({ workspace, channels = [] }) => {
      if (!workspace?.id) {
        console.error("Données workspace invalides :", workspace);
        return;
      }
  
      setWorkspaces((prev) => ({
        ...prev,
        [workspace.id]: workspace,
      }));
  
      const channelMap = {};
      channels.forEach((channel) => {
        channelMap[channel.id] = channel;
      });
      setChannels(channelMap);
  
      if (workspaceIdToSelect === workspace.id || !selectedWorkspace?.id) {
        setSelectedWorkspace(workspace);
        setWorkspaceIdToSelect(null);
      }
  
      if (channelToSelect) {
        const selected = Object.values(channelMap).find(
          (c) => c.id === channelToSelect
        );
        if (selected) {
          setSelectedChannel(selected);
          setChannelToSelect(null);
        }
      }
  
      setWorkspaceInvitation("");
      updateModalState("workspace", false);
      setGuiVisibility((prev) => ({
        ...prev,
        workspaceModal: {
          ...prev.workspaceModal,
          joinWorkspace: false,
        },
      }));
    },
    [workspaceIdToSelect, selectedWorkspace?.id, channelToSelect, updateModalState]
  );

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
    onJoinSuccess,
    user,
    setMessages,
    setConnectedUsers,
    handleNewPublicWorkspace,
    messages,
    channels,
  });

  const edgeGestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.startX = event.absoluteX;
    },
    onActive: (event, ctx) => {
      if (ctx.startX <= EDGE_WIDTH && event.translationX > 0) {
        runOnJS(updateGuiState)('leftPanel', true);
      }
    },
    onEnd: (event) => {
      if (event.velocityX > 200 || event.translationX > SWIPE_THRESHOLD) {
        runOnJS(updateGuiState)('leftPanel', true);
      }
    },
  });

  const handlePressOutside = () => {
    hideAllPopup();
    hideAllModal();
    Keyboard.dismiss();
  };

  const handleCreateWorkspace = async (event) => {
    if (event && event.preventDefault) event.preventDefault();
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

  const handleJoinWorkspace = async (event) => {
    if (event && event.preventDefault) event.preventDefault();
    socket.emit("joinWorkspaceWithInvitation", {
      token: workspaceInvitation,
      user_id: user.id,
      username: user.username,
    });
  };

  const handleCreateChannel = async (event) => {
    if (event && event.preventDefault) event.preventDefault();
    socket.emit("createChannel", {
      name: channelName,
      is_private: channelIsPrivate,
      workspace_id: selectedWorkspace.id,
      user_id: user.id,
    });
    setChannelName("");
    setChannelIsPrivate(false);
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
      if (
        response.result &&
        response.result.result &&
        response.result.result.token
      ) {
        alert(`Invitation link: ${response.result.result.token}`);
      } else {
        console.error("Token not found in response:", response);
      }
    } catch (error) {
      console.error("Error generating invitation:", error);
    }
  };

  const hideAllModal = () => {
    updateModalState("workspace", false);
  };

  const currentUserRoleId = workspaceUsers.find(
    (u) => u.user_id === user.id
  )?.role_id;

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside} accessible={false}>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#fff"
          translucent={false}
        />
        <SafeAreaView style={styles.safeArea}>

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
            channelIsPrivate={channelIsPrivate}
            setWorkspaceName={setWorkspaceName}
            setWorkspaceDescription={setWorkspaceDescription}
            setWorkspaceIsPrivate={setWorkspaceIsPrivate}
            setWorkspaceInvitation={setWorkspaceInvitation}
            setChannelName={setChannelName}
            setChannelIsPrivate={setChannelIsPrivate}
          />

          {!guiVisibility.leftPanel && (
            <DashboardLeft
              workspaces={workspaces}
              selectedWorkspace={selectedWorkspace}
              channels={channels}
              selectedChannel={selectedChannel}
              user={user}
              guiVisibility={guiVisibility}
              updateGuiState={updateGuiState}
              setSelectedWorkspace={setSelectedWorkspace}
              setSelectedChannel={setSelectedChannel}
              hideAllPopup={hideAllPopup}
              getBackground={getBackground}
              getForeground={getForeground}
              publicWorkspaces={publicWorkspaces}
              handleJoinPublicWorkspace={handleJoinPublicWorkspace}
            />
          )}

          <View style={[styles.mainContainer, { position: 'relative' }]}>
            {selectedWorkspace.id && !guiVisibility.discoverWorkspaces ? (
              <DashboardRight
                selectedChannel={selectedChannel}
                selectedWorkspace={selectedWorkspace}
                messages={messages}
                user={user}
                workspaceUsers={workspaceUsers}
                guiVisibility={guiVisibility}
                updateGuiState={updateGuiState}
                getBackground={getBackground}
                getForeground={getForeground}
                hideAllPopup={hideAllPopup}
                connectedUsers={connectedUsers}
                hasNoChannels={Object.keys(channels).length === 0}
                channels={channels}
                notifications={notifications}
                setSelectedChannel={setSelectedChannel}
                channelNotificationPrefs={channelNotificationPrefs}
                setChannelNotificationPrefs={setChannelNotificationPrefs}
                currentUserRoleId={currentUserRoleId}
                theme={theme}
              />
            ) : !guiVisibility.discoverWorkspaces ? (
              <PanGestureHandler
                onGestureEvent={edgeGestureHandler}
                activeOffsetX={[-10, 10]}
                activeOffsetY={[-20, 20]}
              >
                <Reanimated.View style={[styles.gestureContainer]} pointerEvents="box-none">
                  <View style={styles.headerContainer}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => updateGuiState("leftPanel", !guiVisibility.leftPanel)}
                    >
                      <FontAwesome6 name="bars" size={20} color="#666" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Bienvenue sur SupChat</Text>
                    <View style={styles.actionButton} />
                  </View>
                  <View style={styles.emptyStateContainer}>
                    <Text style={styles.emptyStateText}>Aucun espace de travail sélectionné</Text>
                  </View>
                </Reanimated.View>
              </PanGestureHandler>
            ) : (
              <DiscoverWorkspaces
                publicWorkspaces={publicWorkspaces}
                workspaces={workspaces}
                onJoinWorkspace={handleJoinPublicWorkspace}
                onClose={() => updateGuiState("discoverWorkspaces", false)}
                toggleLeftPanel={() => updateGuiState("leftPanel", !guiVisibility.leftPanel)}
              />
            )}
          </View>

          {guiVisibility.leftPanel && (
            <DashboardLeft
              workspaces={workspaces}
              selectedWorkspace={selectedWorkspace}
              channels={channels}
              selectedChannel={selectedChannel}
              user={user}
              guiVisibility={guiVisibility}
              updateGuiState={updateGuiState}
              setSelectedWorkspace={setSelectedWorkspace}
              setSelectedChannel={setSelectedChannel}
              hideAllPopup={hideAllPopup}
              updateModalState={updateModalState}
              getBackground={getBackground}
              getForeground={getForeground}
              publicWorkspaces={publicWorkspaces}
              handleJoinPublicWorkspace={handleJoinPublicWorkspace}
            />
          )}

          <Toast />
        </SafeAreaView>
      </GestureHandlerRootView>
    </TouchableWithoutFeedback>
  );
};

export default DashboardPage; 