import { View, TouchableOpacity, Text } from 'react-native';

const WorkspaceButtons = ({ updateGuiState, updateModalState }) => {
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <TouchableOpacity
        onPress={() => {
          updateGuiState("workspaceModal", {
            createWorkspace: false,
            joinWorkspace: false,
            createChannel: false,
          });
          updateModalState("workspace", true);
        }}
      >
        <Text>➕</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          updateGuiState("discoverWorkspaces", true);
        }}
      >
        <Text>❓</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WorkspaceButtons;