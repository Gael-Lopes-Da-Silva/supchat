import { View, Text, Button } from 'react-native';
import CreateWorkspaceForm from '../DashboardForms/CreateWorkspaceForm';
import JoinWorkspaceForm from '../DashboardForms/JoinWorkspaceForm';
import CreateChannelForm from '../DashboardForms/CreateChannelForm';
import ManageRolesForm from '../DashboardForms/ManageRolesForm';

const WorkspaceModalManager = ({
  display,
  theme,
  guiVisibility,
  updateGuiState,
  updateModalState,
  handleCreateWorkspace,
  handleJoinWorkspace,
  handleCreateChannel,
  handleGenerateInvitation,
  workspaceName,
  workspaceDescription,
  workspaceIsPrivate,
  workspaceInvitation,
  channelName,
  channelIsPrivate,
  setWorkspaceName,
  setWorkspaceDescription,
  setWorkspaceIsPrivate,
  setWorkspaceInvitation,
  setChannelName,
  setChannelIsPrivate,
  selectedWorkspaceId,
  currentUserRoleId,
  selectedWorkspace,
}) => {
  const handleGoBack = () => {
    updateGuiState("workspaceModal", {
      createWorkspace: false,
      joinWorkspace: false,
      createChannel: false,
      manageRoles: false,
    });
  };

  const canGenerateInvitation =
    currentUserRoleId === 1 && selectedWorkspace?.is_private === 1;

  if (!display) return null;

  return (
    <View>
      {!guiVisibility.createWorkspace &&
        !guiVisibility.joinWorkspace &&
        !guiVisibility.createChannel &&
        !guiVisibility.manageRoles && (
          <View>
            <Button title="Créer un espace de travail" onPress={() => updateGuiState("workspaceModal", {
              createWorkspace: true,
              joinWorkspace: false,
              createChannel: false,
            })} />
            <Button title="Rejoindre un espace de travail privé" onPress={() => updateGuiState("workspaceModal", {
              createWorkspace: false,
              joinWorkspace: true,
              createChannel: false,
            })} />
            {currentUserRoleId !== 3 && selectedWorkspaceId && (
              <Button title="Créer un channel" onPress={() => updateGuiState("workspaceModal", {
                createWorkspace: false,
                joinWorkspace: false,
                createChannel: true,
                manageRoles: false,
              })} />
            )}
            {canGenerateInvitation && (
              <Button title="Générer une invitation" onPress={handleGenerateInvitation} />
            )}
            {currentUserRoleId === 1 && (
              <Button title="Gérer les rôles" onPress={() => updateGuiState("workspaceModal", {
                createWorkspace: false,
                joinWorkspace: false,
                createChannel: false,
                manageRoles: true,
              })} />
            )}
          </View>
        )}

      {guiVisibility.createWorkspace && (
        <CreateWorkspaceForm
          theme={theme}
          name={workspaceName}
          description={workspaceDescription}
          isPrivate={workspaceIsPrivate}
          onNameChange={setWorkspaceName}
          onDescChange={setWorkspaceDescription}
          onPrivacyToggle={() => setWorkspaceIsPrivate(!workspaceIsPrivate)}
          onSubmit={handleCreateWorkspace}
        />
      )}

      {guiVisibility.joinWorkspace && (
        <JoinWorkspaceForm
          theme={theme}
          token={workspaceInvitation}
          onTokenChange={setWorkspaceInvitation}
          onSubmit={handleJoinWorkspace}
        />
      )}

      {guiVisibility.createChannel && (
        <CreateChannelForm
          theme={theme}
          name={channelName}
          isPrivate={channelIsPrivate}
          onNameChange={setChannelName}
          onPrivacyToggle={() => setChannelIsPrivate(!channelIsPrivate)}
          onSubmit={handleCreateChannel}
        />
      )}

      {guiVisibility.manageRoles && (
        <ManageRolesForm
          theme={theme}
          workspaceId={selectedWorkspaceId}
          onClose={handleGoBack}
        />
      )}
    </View>
  );
};

export default WorkspaceModalManager;