import { View, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './DashboardLeftStyle';

const WorkspaceButtons = ({ updateGuiState, updateModalState }) => {
  return (
    <View style={styles.workspaceButtonsContainer}>
      <TouchableOpacity
        style={[styles.workspaceButton, styles.addButton]}
        onPress={() => {
          updateGuiState("leftPanel", false);
          updateGuiState("workspaceModal", {
              createWorkspace: false,
              joinWorkspace: false,
              createChannel: false,
          });
          setTimeout(() => {
            updateModalState("workspace", true);
          }, 200);
      }}
      >
        <FontAwesome6 name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.workspaceButton, styles.helpButton]}
        onPress={() => updateGuiState('discoverWorkspaces', true)}
      >
        <FontAwesome6 name="question" size={24} color="#666666" />
      </TouchableOpacity>
    </View>
  );
};

export default WorkspaceButtons;