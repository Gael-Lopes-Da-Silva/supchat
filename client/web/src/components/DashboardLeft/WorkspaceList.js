import React, { useEffect } from 'react';

const WorkspaceList = ({ workspaces, selectedWorkspace, updateGuiState, setSelectedWorkspace, getBackground, getForeground }) => {

    useEffect(() => {
        console.log("WorkspaceList - received workspaces:", workspaces);
    }, [workspaces]);
    
    return (
        <div className="dashboard-left-workspaces-icons">

            {workspaces && Object.values(workspaces).map((workspace) => {
    console.log("Rendering workspace:", workspace); 

                // POURQUOI CETTE CONDITION??
// au moment de la création, le composant reçoit pas tout dsuite les workspaces (ya un pti délai),
// et ca provoque donc une valeur null temporaire. donc la condition permet
// d'éviter une erreur inutile.    
                if (!workspace || !workspace.name) {
                    return null;
                }

                return (
                    <button
                        key={workspace.id}
                        title={workspace.name}
                        onClick={() => {
                            console.log("Selecting workspace:", workspace);

                            updateGuiState("discoverWorkspaces", false);
                            setSelectedWorkspace(workspace);
                        }}
                        style={{
                            background: getBackground(workspace.name),
                            color: getForeground(workspace.name),
                        }}
                    >
                        <p>{workspace.name[0].toUpperCase()}</p>
                        <span
                            style={{
                                display: selectedWorkspace.id !== workspace.id ? "none" : "",
                            }}
                        ></span>
                    </button>
                );
            })}
        </div>
    );
};


export default WorkspaceList;
