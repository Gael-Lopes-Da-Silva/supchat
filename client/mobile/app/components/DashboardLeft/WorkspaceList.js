import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './DashboardLeftStyle';

const WorkspaceList = ({
  workspaces,
  selectedWorkspace,
  updateGuiState,
  setSelectedWorkspace,
  setSelectedChannel,
  channels,
  getBackground,
  getForeground,
  theme,
}) => {
  const borderColor = theme === 'dark' ? '#333333' : '#e5e5e5';

  return (
    <View style={styles.workspaceListContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {workspaces && Object.values(workspaces).map((workspace) => {
          if (!workspace || !workspace.name) {
            return null;
          }

          const isSelected = selectedWorkspace?.id === workspace.id;

          return (
            <TouchableOpacity
              key={workspace.id}
              style={[
                styles.workspaceListButton,
                { 
                  backgroundColor: getBackground(workspace.name),
                  borderColor: getForeground(workspace.name),
                }
              ]}
              onPress={() => {
                updateGuiState('discoverWorkspaces', false);
                setSelectedWorkspace(workspace);
              }}
            >
              <View
              style={[
                styles.workspaceAvatar,
                { backgroundColor: getBackground(workspace.name) },
              ]}
            >
              <Text
                style={[
                  styles.workspaceInitial,
                  { color: getForeground(workspace.name) },
                ]}
              >
                {workspace.name[0].toUpperCase()}
              </Text>
            </View>
              {isSelected && (
                <View style={styles.workspaceIndicator} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default WorkspaceList;