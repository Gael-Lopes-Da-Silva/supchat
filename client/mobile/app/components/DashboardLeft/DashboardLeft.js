import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Reanimated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import WorkspaceList from './WorkspaceList';
import WorkspaceButtons from './WorkspaceButtons';
import ChannelList from './ChannelList';
import styles from './DashboardLeftStyle';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.7;
const SWIPE_THRESHOLD = DRAWER_WIDTH / 3;

const DashboardLeft = ({
  workspaces = {},
  selectedWorkspace = null,
  channels = {},
  selectedChannel = null,
  user = null,
  guiVisibility = { leftPanel: false },
  updateGuiState = () => { },
  setSelectedWorkspace = () => { },
  setSelectedChannel = () => { },
  hideAllPopup = () => { },
  updateModalState,
  getBackground = () => '#ccc',
  getForeground = () => '#000',
  publicWorkspaces = [],
  handleJoinPublicWorkspace = () => { },
}) => {
  const [theme, setTheme] = useState('light');
  const [isReady, setIsReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const translateX = useSharedValue(-DRAWER_WIDTH);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('gui.theme');
        setTheme(savedTheme || 'light');
      } catch (error) {
        console.error('Erreur chargement thème:', error);
      }
      setIsReady(true);
    };
    loadTheme();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    translateX.value = withSpring(
      guiVisibility.leftPanel ? 0 : -DRAWER_WIDTH,
      {
        damping: 20,
        stiffness: 100,
      }
    );
  }, [guiVisibility.leftPanel, isReady]);

  const drawerGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      const newValue = ctx.startX + event.translationX;
      translateX.value = Math.max(-DRAWER_WIDTH, Math.min(0, newValue));
    },
    onEnd: (event) => {
      const shouldOpen = event.velocityX > 500 || translateX.value > -SWIPE_THRESHOLD;
      translateX.value = withSpring(shouldOpen ? 0 : -DRAWER_WIDTH, {
        damping: 20,
        stiffness: 100,
        velocity: event.velocityX,
      });
      runOnJS(updateGuiState)('leftPanel', shouldOpen);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backgroundColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  const borderColor = theme === 'dark' ? '#333333' : '#e5e5e5';
  const inputBackgroundColor = theme === 'dark' ? '#333333' : '#f0f0f0';

  if (!isReady) return null;

  const filteredChannels = searchQuery
    ? Object.fromEntries(
      Object.entries(channels).filter(([_, channel]) =>
        channel.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    : channels;

  return (
    <GestureHandlerRootView style={{ position: 'absolute', left: 0, top: 0, bottom: 0, right: 0 }}>
      <PanGestureHandler
        onGestureEvent={drawerGestureHandler}
        activeOffsetX={[-5, 5]}
      >
        <Reanimated.View
          style={[
            styles.container,
            animatedStyle,
            { backgroundColor, borderRightColor: borderColor },
          ]}
          pointerEvents={guiVisibility.leftPanel ? "auto" : "none"}
        >
          <View style={[styles.workspacesSection, { borderRightColor: borderColor }]}>
            <WorkspaceList
              user={user}
              workspaces={workspaces}
              publicWorkspaces={publicWorkspaces}
              selectedWorkspace={selectedWorkspace}
              updateGuiState={updateGuiState}
              setSelectedWorkspace={setSelectedWorkspace}
              setSelectedChannel={setSelectedChannel}
              channels={channels}
              getBackground={getBackground}
              getForeground={getForeground}
              handleJoinPublicWorkspace={handleJoinPublicWorkspace}
              theme={theme}
            />

            <WorkspaceButtons
              updateGuiState={updateGuiState}
              updateModalState={updateModalState}
              theme={theme}
            />
          </View>

          <View style={styles.mainContent}>
            {selectedWorkspace?.id && (
              <>
                <View style={[styles.workspaceHeader, { borderBottomColor: borderColor }]}>
                  <View style={styles.workspaceInfo}>
                    <Text style={[styles.workspaceName, { color: textColor }]}>
                      {selectedWorkspace.name || ''}
                    </Text>
                    {selectedChannel?.id && (
                      <Text style={[styles.channelName, { color: textColor }]}>
                        {selectedChannel.name}
                      </Text>
                    )}
                  </View>
                </View>

                {Object.keys(channels).length > 0 && selectedWorkspace?.id && (
                  <View style={[styles.searchContainer, { borderBottomColor: borderColor }]}>
                    <TextInput
                      style={[
                        styles.searchInput,
                        { backgroundColor: inputBackgroundColor, color: textColor }
                      ]}
                      placeholder="Rechercher un canal..."
                      placeholderTextColor={theme === 'dark' ? '#999999' : '#666666'}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                  </View>
                )}

                <View style={styles.channelsSection}>
                  {Object.keys(channels).length > 0 ? (
                    <ChannelList
                      channels={filteredChannels}
                      setSelectedChannel={setSelectedChannel}
                      selectedChannel={selectedChannel}
                      getBackground={getBackground}
                      getForeground={getForeground}
                      user={user}
                      theme={theme}
                    />
                  ) : (
                    <View style={styles.noChannelsContainer}>
                      <Text style={[styles.noChannelsText, { color: textColor }]}>
                        Aucun canal trouvé
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )}

            <View style={[styles.footer, { borderTopColor: borderColor }]}>
              <View style={styles.profileButton}>
                <View
                  style={[
                    styles.profileAvatar,
                    {
                      backgroundColor: getBackground(user?.username || '?'),
                    },
                  ]}
                >
                  <Text style={[styles.profileInitial, { color: getForeground(user?.username || '?') }]}>
                    {(user?.username?.[0] || '?').toUpperCase()}
                  </Text>
                </View>
                <Text style={[styles.username, { color: textColor }]}>
                  {user?.username || 'Utilisateur'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => router.push('/screens/SettingsScreen/SettingsScreen')}
              >
                <FontAwesome6 name="gear" size={20} color={textColor} />
              </TouchableOpacity>
            </View>
          </View>
        </Reanimated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default DashboardLeft;