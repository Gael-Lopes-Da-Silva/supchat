import * as Fa from "react-icons/fa6";
import Modal from "../Modal/Modal";
import CreateWorkspaceForm from "../DashboardForms/CreateWorkspaceForm";
import JoinWorkspaceForm from "../DashboardForms/JoinWorkspaceForm";
import CreateChannelForm from "../DashboardForms/CreateChannelForm";
import ManageRolesForm from "../DashboardForms/ManageRolesForm";

const WorkspaceModalManager = ({
  modalRef,
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

  return (
    <Modal
      ref={modalRef}
      display={display}
      goBack={
        guiVisibility.createWorkspace ||
        guiVisibility.joinWorkspace ||
        guiVisibility.createChannel
      }
      onClose={() => updateModalState("workspace", false)}
      onGoBack={handleGoBack}
      title="Gérer les espaces de travail, channels et rôles"
      theme={theme}
      content={
        <div>
          {/* Choix des actions */}
          {!guiVisibility.createWorkspace &&
            !guiVisibility.joinWorkspace &&
            !guiVisibility.createChannel &&
            !guiVisibility.manageRoles && (
              <main>
                <button
                  onClick={() =>
                    updateGuiState("workspaceModal", {
                      createWorkspace: true,
                      joinWorkspace: false,
                      createChannel: false,
                    })
                  }
                >
                  Créer un espace de travail <Fa.FaChevronRight />
                </button>
                <button
                  onClick={() =>
                    updateGuiState("workspaceModal", {
                      createWorkspace: false,
                      joinWorkspace: true,
                      createChannel: false,
                    })
                  }
                >
                  Rejoindre un espace de travail privé <Fa.FaChevronRight />
                </button>

                {currentUserRoleId !== 3 && selectedWorkspaceId && (
                  <button
                    onClick={() =>
                      updateGuiState("workspaceModal", {
                        createWorkspace: false,
                        joinWorkspace: false,
                        createChannel: true,
                        manageRoles: false,
                      })
                    }
                  >
                    Créer un channel <Fa.FaChevronRight />
                  </button>
                )}

                {canGenerateInvitation && (
                  <button onClick={handleGenerateInvitation}>
                    Générer une invitation
                  </button>
                )}

                {currentUserRoleId === 1 && (
                  <button
                    onClick={() =>
                      updateGuiState("workspaceModal", {
                        createWorkspace: false,
                        joinWorkspace: false,
                        createChannel: false,
                        manageRoles: true,
                      })
                    }
                  >
                    Gérer les rôles <Fa.FaChevronRight />
                  </button>
                )}
              </main>
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
              onClose={() =>
                updateGuiState("workspaceModal", {
                  createWorkspace: false,
                  joinWorkspace: false,
                  createChannel: false,
                  manageRoles: false,
                })
              }
            />
          )}
        </div>
      }
    />
  );
};

export default WorkspaceModalManager;
