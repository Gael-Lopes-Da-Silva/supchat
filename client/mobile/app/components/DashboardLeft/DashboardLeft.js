import { View, Text, TouchableOpacity } from 'react-native';
import WorkspaceButtons from './WorkspaceButtons';
import WorkspaceList from './WorkspaceList';
import ChannelList from './ChannelList';

const DashboardLeft = ({
  workspaces,
  selectedWorkspace,
  channels,
  selectedChannel,
  user,
  guiVisibility,
  updateGuiState,
  setSelectedWorkspace,
  setSelectedChannel,
  hideAllPopup,
  updatePopupState,
  updateModalState,
  setMousePosition,
  getBackground,
  getForeground,
  publicWorkspaces,
  handleJoinPublicWorkspace,
}) => {
  if (!guiVisibility.leftPanel) return null;

  return (
    <View>
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
      />
      <WorkspaceButtons
        updateGuiState={updateGuiState}
        updateModalState={updateModalState}
      />
      {selectedWorkspace.id && (
        <View>
          <Text style={{ fontWeight: 'bold' }}>{selectedWorkspace.name}</Text>
          {selectedWorkspace.description && (
            <Text>{selectedWorkspace.description}</Text>
          )}
          <ChannelList
            channels={channels}
            setSelectedChannel={setSelectedChannel}
            selectedChannel={selectedChannel}
            getBackground={getBackground}
            getForeground={getForeground}
            user={user}
          />
        </View>
      )}
      <TouchableOpacity onPress={() => updatePopupState("profile", true)}>
        <Text style={{ backgroundColor: getBackground(user.username), color: getForeground(user.username) }}>
          {user.username[0].toUpperCase()} - {user.username}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DashboardLeft;