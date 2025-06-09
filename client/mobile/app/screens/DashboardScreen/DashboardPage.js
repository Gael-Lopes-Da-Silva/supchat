import { useEffect, useState, useCallback, useRef } from 'react';
import { View, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';
import * as Audio from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import DashboardLeft from '../../components/DashboardLeft/DashboardLeft';
import DashboardRight from '../../components/DashboardRight/DashboardRight';
import useSocketEvents from '../../hooks/useSocketEvents';
import { createWorkspaceInvitation } from '../../../services/WorkspaceInvitations';
import { getPublicWorkspaces } from '../../../services/Workspaces';
import { getBackground, getForeground } from '../../../utils/colorUtils';
import socket from '../../socket';
import styles from './DashboardPageStyles';

const API_URL = Constants.expoConfig.extra.apiUrl;

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
    leftPanel: true,
    userList: false,
    discoverWorkspaces: false,
  });

  const notificationSound = useRef(null);
  const router = useRouter();

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
          router.replace('/screens/LoginScreen/LoginPage');
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
        router.replace('/screens/LoginScreen/LoginPage');
      }
    };
    loadUser();
  }, [router]);

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
      }
    });
  }, [user]);

  useEffect(() => {
    const workspaceArray = Object.values(workspaces);
    if (workspaceArray.length > 0 && !selectedWorkspace?.id) {
      setSelectedWorkspace(workspaceArray[0]);
    }
  }, [workspaces, selectedWorkspace?.id]);

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
      userList: false,
      discoverWorkspaces: false,
    }));
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
    onJoinSuccess: ({ workspace, channels = [] }) => {
      if (!workspace?.id) {
        console.error('Données workspace invalides:', workspace);
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
        setWorkspaceIdToSelect(null);
      }

      if (channelToSelect) {
        const selected = Object.values(channelMap).find(
          c => c.id === channelToSelect
        );
        if (selected) {
          setSelectedChannel(selected);
          setChannelToSelect(null);
        }
      }
    },
    user,
    setMessages,
    setConnectedUsers,
    handleNewPublicWorkspace,
    messages,
    channels,
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar 
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={false}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mainContainer}>
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
            currentUserRoleId={user?.role_id}
          />
          
          <View style={styles.leftPanelContainer}>
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
          </View>
        </View>

        <Toast />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};



export default DashboardPage; 