import React, { useEffect } from 'react';
import * as Fa from "react-icons/fa6";

const WorkspaceList = ({ workspaces, selectedWorkspace, updateGuiState, setSelectedWorkspace, getBackground, getForeground }) => {

    return (
        <div className="dashboard-left-workspaces-icons">

            {workspaces && Object.values(workspaces).map((workspace) => {

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
                        <p>
                            {workspace.name?.[0]?.toUpperCase()}
                            {Boolean(workspace.is_private) && ( // j'recois le boleeen en string donc jle convertis
                                <Fa.FaLock  />
                            )}

                        </p>


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
