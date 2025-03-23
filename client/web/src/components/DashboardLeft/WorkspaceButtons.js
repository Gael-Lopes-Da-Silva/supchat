import React from 'react';
import * as Fa from "react-icons/fa6";

const WorkspaceButtons = ({ updateGuiState, updateModalState }) => {
    return (
        <div className="dashboard-left-workspaces-buttons">
            <button
                onClick={(event) => {
                    event.stopPropagation();
                    updateGuiState("workspaceModal", {
                        createWorkspace: false,
                        joinWorkspace: false,
                        createChannel: false,
                    });
                    updateModalState("workspace", true);
                }}
                title="Ajouter/Rejoindre un espace de travail ou créer un channel"
            >
                <Fa.FaPlus />
            </button>
            <button
                onClick={() => {
                    updateGuiState("discoverWorkspaces", true);
                }}
                title="Découvrir de nouveaux espaces de travail"
            >
                <Fa.FaQuestion />
            </button>
        </div>
    );
};

export default WorkspaceButtons;
