import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './DashboardLeftStyle';

const WorkspaceButtons = ({ updateGuiState }) => {
  return (
    <View style={styles.workspaceButtonsContainer}>
      <TouchableOpacity
        style={[styles.workspaceButton, styles.addButton]}
        onPress={() => updateGuiState('workspaceCreator', true)}
      >
        <FontAwesome6 name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.workspaceButton, styles.helpButton]}
        onPress={() => updateGuiState('help', true)}
      >
        <FontAwesome6 name="question" size={24} color="#666666" />
      </TouchableOpacity>
    </View>
  );
};

export default WorkspaceButtons;