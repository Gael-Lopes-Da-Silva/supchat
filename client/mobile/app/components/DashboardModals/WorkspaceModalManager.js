import { View, TouchableOpacity, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Modal from '../../components/Modal/Modal';
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

  const title = "Gérer les espaces de travail, channels et rôles";

  return (
    <Modal
      display={display}
      theme={theme}
      goBack={
        guiVisibility.createWorkspace ||
        guiVisibility.joinWorkspace ||
        guiVisibility.createChannel
      }
      onClose={() => updateModalState && updateModalState("workspace", false)}
      onGoBack={handleGoBack}
      title={title}
      content={
        <View>
          {/* Choix des actions */}
          {!guiVisibility.createWorkspace &&
            !guiVisibility.joinWorkspace &&
            !guiVisibility.createChannel &&
            !guiVisibility.manageRoles && (
              <View>
                <TouchableOpacity
                  style={{ marginBottom: 8 }}
                  onPress={() => updateGuiState("workspaceModal", {
                    createWorkspace: true,
                    joinWorkspace: false,
                    createChannel: false,
                  })}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>Créer un espace de travail</Text>
                    <FontAwesome6 name="chevron-right" size={16} color="#333" style={{ marginLeft: 8 }} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginBottom: 8 }}
                  onPress={() => updateGuiState("workspaceModal", {
                    createWorkspace: false,
                    joinWorkspace: true,
                    createChannel: false,
                  })}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>Rejoindre un espace de travail privé</Text>
                    <FontAwesome6 name="chevron-right" size={16} color="#333" style={{ marginLeft: 8 }} />
                  </View>
                </TouchableOpacity>
                {currentUserRoleId !== 3 && selectedWorkspaceId && (
                  <TouchableOpacity
                    style={{ marginBottom: 8 }}
                    onPress={() => updateGuiState("workspaceModal", {
                      createWorkspace: false,
                      joinWorkspace: false,
                      createChannel: true,
                      manageRoles: false,
                    })}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text>Créer un channel</Text>
                      <FontAwesome6 name="chevron-right" size={16} color="#333" style={{ marginLeft: 8 }} />
                    </View>
                  </TouchableOpacity>
                )}
                {canGenerateInvitation && (
                  <TouchableOpacity
                    style={{ marginBottom: 8 }}
                    onPress={handleGenerateInvitation}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text>Générer une invitation</Text>
                      <FontAwesome6 name="chevron-right" size={16} color="#333" style={{ marginLeft: 8 }} />
                    </View>
                  </TouchableOpacity>
                )}
                {currentUserRoleId === 1 && (
                  <TouchableOpacity
                    onPress={() => updateGuiState("workspaceModal", {
                      createWorkspace: false,
                      joinWorkspace: false,
                      createChannel: false,
                      manageRoles: true,
                    })}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text>Gérer les rôles</Text>
                      <FontAwesome6 name="chevron-right" size={16} color="#333" style={{ marginLeft: 8 }} />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            )}

          {/* Formulaires */}
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
      }
    />
  );
};

export default WorkspaceModalManager;