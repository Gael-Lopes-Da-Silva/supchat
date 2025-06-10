import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import styles from './DashboardLeftStyle';

const WorkspaceList = ({
  workspaces,
  selectedWorkspace,
  updateGuiState,
  setSelectedWorkspace,
  getBackground,
  getForeground,
  theme,
}) => {
  const borderColor = theme === 'dark' ? '#333333' : '#e5e5e5';

  return (
    <View style={styles.workspaceListContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.entries(workspaces).map(([id, workspace]) => (
          <TouchableOpacity
            key={id}
            style={[
              styles.workspaceListButton,
              selectedWorkspace?.id === id && styles.selectedWorkspace,
              { borderColor: borderColor },
            ]}
            onPress={() => {
              setSelectedWorkspace(workspace);
              updateGuiState('leftPanel', true);
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
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default WorkspaceList;