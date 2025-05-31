import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
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

import WorkspaceList from './WorkspaceList';
import WorkspaceButtons from './WorkspaceButtons';
import ChannelList from './ChannelList';

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
  updateGuiState = () => {},
  setSelectedWorkspace = () => {},
  setSelectedChannel = () => {},
  hideAllPopup = () => {},
  getBackground = () => '#ccc',
  getForeground = () => '#000',
  publicWorkspaces = [],
  handleJoinPublicWorkspace = () => {},
}) => {
  const [theme, setTheme] = useState('light');
  const [isReady, setIsReady] = useState(false);
  const translateX = useSharedValue(-DRAWER_WIDTH);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('gui.theme');
        setTheme(savedTheme || 'light');
      } catch (error) {
        console.error('Erreur chargement thème:', error);
      }
      setIsReady(true);
      updateGuiState('leftPanel', false);
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

  // Gestionnaire pour la fermeture du drawer
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

  if (!isReady) return null;

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFill}>
      {/* Le drawer avec gestion de la fermeture */}
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
        >
          <View style={styles.workspacesSection}>
            <WorkspaceList
              user={user}
              workspaces={workspaces}
              publicWorkspaces={publicWorkspaces}
              selectedWorkspace={selectedWorkspace}
              updateGuiState={updateGuiState}
              setSelectedWorkspace={setSelectedWorkspace}
              getBackground={getBackground}
              getForeground={getForeground}
              handleJoinPublicWorkspace={handleJoinPublicWorkspace}
              theme={theme}
            />

            <WorkspaceButtons
              updateGuiState={updateGuiState}
              theme={theme}
            />
          </View>

          {selectedWorkspace?.id && (
            <>
              <TouchableOpacity
                style={[styles.workspaceHeader, { borderBottomColor: borderColor }]}
                onPress={hideAllPopup}
              >
                <View style={styles.workspaceInfo}>
                  <Text style={[styles.workspaceName, { color: textColor }]}>
                    {selectedWorkspace.name || 'Sans nom'}
                  </Text>
                  {selectedWorkspace.description && (
                    <Text style={[styles.workspaceDescription, { color: textColor }]}>
                      {selectedWorkspace.description}
                    </Text>
                  )}
                </View>
                <FontAwesome6 name="chevron-down" size={16} color={textColor} />
              </TouchableOpacity>

              <View style={styles.channelsSection}>
                <ChannelList
                  channels={channels}
                  setSelectedChannel={setSelectedChannel}
                  selectedChannel={selectedChannel}
                  getBackground={getBackground}
                  getForeground={getForeground}
                  user={user}
                  theme={theme}
                />
              </View>
            </>
          )}

          <View style={[styles.footer, { borderTopColor: borderColor }]}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={hideAllPopup}
            >
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
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => {}}
            >
              <FontAwesome6 name="gear" size={20} color={textColor} />
            </TouchableOpacity>
          </View>
        </Reanimated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    borderRightWidth: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  workspacesSection: {
    flexDirection: 'row',
    height: 70,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  workspaceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  workspaceInfo: {
    flex: 1,
    marginRight: 8,
  },
  workspaceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  workspaceDescription: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  channelsSection: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderTopWidth: 1,
  },
  profileButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  username: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  settingsButton: {
    padding: 8,
  },
});

export default DashboardLeft;