import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './DashboardLeftStyle';

const WorkspaceButtons = ({ updateGuiState, theme }) => {
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';

  return (
    <View style={styles.workspaceButtonsContainer}>
      <TouchableOpacity
        style={styles.workspaceButton}
        onPress={() => updateGuiState('createWorkspace', true)}
      >
        <FontAwesome6 name="plus" size={18} color={textColor} />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.workspaceButton}
        onPress={() => updateGuiState('joinWorkspace', true)}
      >
        <FontAwesome6 name="right-to-bracket" size={18} color={textColor} />
      </TouchableOpacity>
    </View>
  );
};

export default WorkspaceButtons;