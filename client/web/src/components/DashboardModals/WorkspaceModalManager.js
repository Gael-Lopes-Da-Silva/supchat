import React from "react";
import * as Fa from "react-icons/fa6";
import Modal from "../Modal/Modal";
import CreateWorkspaceForm from "../DashboardForms/CreateWorkspaceForm";
import JoinWorkspaceForm from "../DashboardForms/JoinWorkspaceForm";
import CreateChannelForm from "../DashboardForms/CreateChannelForm";

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
  channelDescription,
  channelIsPrivate,
  setWorkspaceName,
  setWorkspaceDescription,
  setWorkspaceIsPrivate,
  setWorkspaceInvitation,
  setChannelName,
  setChannelDescription,
  setChannelIsPrivate,
}) => {
  const handleGoBack = () => {
    updateGuiState("workspaceModal", {
      createWorkspace: false,
      joinWorkspace: false,
      createChannel: false,
    });
  };

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
      title="Ajouter/Rejoindre un espace de travail ou créer un channel"
      theme={theme}
      content={
        <div>
          {/* Choix des actions */}
          {!guiVisibility.createWorkspace &&
            !guiVisibility.joinWorkspace &&
            !guiVisibility.createChannel && (
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
                  Rejoindre un espace de travail <Fa.FaChevronRight />
                </button>
                <button
                  onClick={() =>
                    updateGuiState("workspaceModal", {
                      createWorkspace: false,
                      joinWorkspace: false,
                      createChannel: true,
                    })
                  }
                >
                  Créer un channel <Fa.FaChevronRight />
                </button>

                <button onClick={handleGenerateInvitation}>
                  Générer une invitation
                </button>
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
              onPrivacyToggle={() =>
                setWorkspaceIsPrivate(!workspaceIsPrivate)
              }
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
              description={channelDescription}
              isPrivate={channelIsPrivate}
              onNameChange={setChannelName}
              onDescChange={setChannelDescription}
              onPrivacyToggle={() => setChannelIsPrivate(!channelIsPrivate)}
              onSubmit={handleCreateChannel}
            />
          )}
        </div>
      }
    />
  );
};

export default WorkspaceModalManager;
