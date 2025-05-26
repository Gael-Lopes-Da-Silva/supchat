import { View, Text, TouchableOpacity } from 'react-native';

const WorkspaceList = ({ workspaces, selectedWorkspace, updateGuiState, setSelectedWorkspace, getBackground, getForeground }) => {
  return (
    <View>
      {Object.values(workspaces).map((workspace) => {
        if (!workspace || !workspace.name) return null;

        return (
          <TouchableOpacity
            key={workspace.id}
            onPress={() => {
              updateGuiState("discoverWorkspaces", false);
              setSelectedWorkspace(workspace);
            }}
            style={{
              backgroundColor: getBackground(workspace.name),
              padding: 10,
              marginVertical: 4,
            }}
          >
            <Text style={{ color: getForeground(workspace.name) }}>
              {workspace.name[0].toUpperCase()} {Boolean(workspace.is_private) ? '🔒' : ''}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default WorkspaceList;