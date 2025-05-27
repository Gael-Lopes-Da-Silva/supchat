import * as Fa from "react-icons/fa6";

const DiscoverWorkspaces = ({
  publicWorkspaces,
  workspaces,
  onJoinWorkspace,
  onClose,
  toggleLeftPanel,
}) => {
  const filteredWorkspaces = publicWorkspaces.filter(ws => !workspaces[ws.id]);

  return (
    <div className="dashboard-right">
      <div className="dashboard-right-content">
        <header>
          <div className="dashboard-right-header-buttons">
            <button
              onClick={toggleLeftPanel}
              title="Afficher/Masquer le panneau de gauche"
            >
              <Fa.FaBars />
            </button>
          </div>
          <p>Découvrir de nouveaux espaces de travail</p>
          <div className="dashboard-right-header-buttons">
            <button onClick={onClose} title="Fermer">
              <Fa.FaXmark />
            </button>
          </div>
        </header>

        <main className="public-workspaces-grid">
          {filteredWorkspaces.length === 0 ? (
            <p>Aucun espace de travail public disponible. N'hésitez pas à en créer un !</p>
          ) : (
            filteredWorkspaces.map(ws => (
              <div key={ws.id} className="public-workspace-card">
                <h3>{ws.name}</h3>
                <p>{ws.description}</p>
                <button onClick={() => onJoinWorkspace(ws)}>
                  Rejoindre
                </button>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
};

export default DiscoverWorkspaces;
