import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

const WorkspaceButtons = ({ updateGuiState, theme }) => {
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => updateGuiState('createWorkspace', true)}
      >
        <FontAwesome6 name="plus" size={18} color={textColor} />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => updateGuiState('joinWorkspace', true)}
      >
        <FontAwesome6 name="right-to-bracket" size={18} color={textColor} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
});

export default WorkspaceButtons;