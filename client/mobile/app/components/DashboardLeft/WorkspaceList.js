import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

const WorkspaceList = ({
  user,
  workspaces = {},
  publicWorkspaces = [],
  selectedWorkspace,
  updateGuiState,
  setSelectedWorkspace,
  getBackground,
  getForeground,
  handleJoinPublicWorkspace,
  theme,
}) => {
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  const borderColor = theme === 'dark' ? '#333333' : '#e5e5e5';

  const getWorkspaceInitial = (name) => {
    if (!name || typeof name !== 'string') return '?';
    return name.charAt(0).toUpperCase();
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {Object.values(workspaces).map((workspace) => {
        if (!workspace || !workspace.id || !workspace.name) return null;
        
        return (
          <TouchableOpacity
            key={workspace.id}
            style={[
              styles.workspaceButton,
              selectedWorkspace?.id === workspace.id && styles.selectedWorkspace,
              { borderColor },
            ]}
            onPress={() => {
              setSelectedWorkspace(workspace);
            }}
          >
            <View
              style={[
                styles.workspaceAvatar,
                {
                  backgroundColor: getBackground(workspace.name),
                },
              ]}
            >
              <Text
                style={[
                  styles.workspaceInitial,
                  { color: getForeground(workspace.name) },
                ]}
              >
                {getWorkspaceInitial(workspace.name)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        style={[styles.addButton, { borderColor }]}
        onPress={() => updateGuiState('discoverWorkspaces', true)}
      >
        <FontAwesome6 name="plus" size={20} color={textColor} />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  workspaceButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    marginHorizontal: 4,
    borderWidth: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedWorkspace: {
    borderColor: '#007AFF',
  },
  workspaceAvatar: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workspaceInitial: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    marginHorizontal: 4,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WorkspaceList;