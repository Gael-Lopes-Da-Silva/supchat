import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as Fa from "react-icons/fa6";

import { authentificationHook } from "../../hooks/Authentification";

import { readWorkspaceMember } from "../../services/WorkspaceMembers";
import { createWorkspace, readWorkspace } from "../../services/Workspaces";

import InputField from "../../components/InputField/InputField";
import Checkbox from "../../components/Checkbox/Checkbox";
import Button from "../../components/Button/Button";
import Popup from "../../components/Popup/Popup";
import Modal from "../../components/Modal/Modal";

import "./DashboardPage.css";

const DashboardPage = () => {
  const [user, setUser] = useState("");

  const [workspaces, setWorkspaces] = useState({});
  const [selectedWorkspace, setSelectedWorkspace] = useState({});
  const [channels, setChannels] = useState({});
  const [selectedChannel, setSelectedChannel] = useState({});

  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [workspaceIsPrivate, setWorkspaceIsPrivate] = useState(false);

  const [workspaceInvitation, setWorkspaceInvitation] = useState("");

  const [theme, setTheme] = useState("light");

  const [guiVisibility, setGuiVisibility] = useState({
    userList: false,
    leftPanel: true,
    discoverWorkspaces: false,
    workspaceModal: {
      createWorkspace: false,
      joinWorkspace: false,
    },
  });
  const [popupVisibility, setPopupVisibility] = useState({
    profile: false,
    pinned: false,
    notifications: false,
    emojis: false,
    workspace: false,
  });
  const [modalVisibility, setModalVisibility] = useState({
    workspace: false,
  });

  const dashboardContainerRef = useRef(null);
  const modalRefs = {
    workspace: useRef(null),
  };
  const popupRefs = {
    profile: useRef(null),
    pinned: useRef(null),
    notifications: useRef(null),
    emojis: useRef(null),
    workspace: useRef(null),
  };

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();

  useEffect(() => {
    authentificationHook(navigate);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.data) {
      navigate("/login", { state: { expired: true } });
      return;
    }

    setUser(storedUser.data);

    readWorkspaceMember({
      user_id: user.id,
    })
      .then((data) => {
        const workspacePromises = data.result.map(async (workspaceMember) => {
          return readWorkspace({ id: workspaceMember.workspace_id })
            .then((data) => ({ id: data.result.id, data: data.result }))
            .catch((error) => {
              if (process.env.REACT_APP_ENV === "dev") console.error(error);
            });
        });

        Promise.all(workspacePromises).then((results) => {
          const newWorkspaces = {};
          results.forEach((workspace) => {
            if (workspace) {
              newWorkspaces[workspace.id] = workspace.data;
            }
          });
          setWorkspaces(newWorkspaces);
        });
      })
      .catch((error) => {
        if (process.env.REACT_APP_ENV === "dev") console.error(error);
      });

    const showUserList = localStorage.getItem("gui.dashboard.show_user_list");
    if (showUserList !== null)
      updateGuiState("userList", showUserList === "true");

    if (localStorage.getItem("gui.theme")) {
      setTheme(localStorage.getItem("gui.theme"));
    }

    document.addEventListener("click", handleOutsideClicks);
  }, [navigate]);

  const updateGuiState = (key, value) => {
    setGuiVisibility((prev) => ({ ...prev, [key]: value }));
  };

  const updatePopupState = (key, value) => {
    setPopupVisibility((prev) => ({ ...prev, [key]: value }));
  };

  const updateModalState = (key, value) => {
    setModalVisibility((prev) => ({ ...prev, [key]: value }));
  };

  const hideAllPopup = () => {
    updatePopupState("profile", false);
    updatePopupState("pinned", false);
    updatePopupState("notifications", false);
    updatePopupState("emojis", false);
    updatePopupState("workspace", false);
  };

  const hideAllModal = () => {
    updateModalState("workspace", false);
  };

  const handleOutsideClicks = (event) => {
    const isOutsideDashboard =
      dashboardContainerRef.current &&
      !dashboardContainerRef.current.contains(event.target);

    const isOutsideModal = Object.values(modalRefs).every(
      (modalRef) =>
        !modalRef?.current || !modalRef.current.contains(event.target)
    );

    const isOutsidePopups = Object.values(popupRefs).every(
      (popupRef) =>
        !popupRef?.current || !popupRef.current.contains(event.target)
    );

    if (!isOutsideDashboard && isOutsideModal && isOutsidePopups) {
      hideAllPopup();
      hideAllModal();
    }
  };

  const handleCreateWorkspace = (event) => {
    event.preventDefault();

    createWorkspace({
      name: workspaceName,
      description: workspaceDescription,
      is_private: workspaceIsPrivate,
      user_id: user.id,
    })
      .then((data) => {
        readWorkspace({
          id: data.result.insertId,
        })
          .then((data) => {
            setWorkspaces((prev) => ({
              ...prev,
              [data.result.id]: data.result,
            }));
            setSelectedWorkspace(data.result);
          })
          .catch((error) => {
            if (process.env.REACT_APP_ENV === "dev") console.error(error);
          });
      })
      .catch((error) => {
        if (process.env.REACT_APP_ENV === "dev") console.error(error);
      });

    setWorkspaceName("");
    setWorkspaceDescription("");
    setWorkspaceIsPrivate(false);
    hideAllModal();
  };

  const handleJoinWorkspace = (event) => {
    event.preventDefault();

    setWorkspaceInvitation("");
    hideAllModal();
  };

  const getBackground = (text) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
    }

    return `#${((hash >> 24) & 0xff).toString(16).padStart(2, "0")}${(
      (hash >> 16) &
      0xff
    )
      .toString(16)
      .padStart(2, "0")}${((hash >> 8) & 0xff).toString(16).padStart(2, "0")}`;
  };

  const getForeground = (text) => {
    const background = getBackground(text);
    const color = background.replace("#", "");

    const r = parseInt(color.substring(0, 2), 16) / 255;
    const g = parseInt(color.substring(2, 4), 16) / 255;
    const b = parseInt(color.substring(4, 6), 16) / 255;

    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };

  return (
    <div ref={dashboardContainerRef} className={`dashboard-container ${theme}`}>
      <Modal
        ref={modalRefs.workspace}
        display={modalVisibility.workspace}
        goBack={
          guiVisibility.workspaceModal.createWorkspace ||
          guiVisibility.workspaceModal.joinWorkspace
        }
        onClose={() => {
          updateModalState("workspace", false);
        }}
        onGoBack={() => {
          updateGuiState("workspaceModal", {
            createWorkspace: false,
            joinWorkspace: false,
          });
        }}
        title="Ajouter/Rejoindre un espace de travail"
        theme={theme}
        content={
          <div>
            {!(
              guiVisibility.workspaceModal.createWorkspace ||
              guiVisibility.workspaceModal.joinWorkspace
            ) && (
              <main>
                <button
                  onClick={() => {
                    updateGuiState("workspaceModal", {
                      createWorkspace: true,
                      joinWorkspace: false,
                    });
                  }}
                >
                  Créer un espace de travail
                  <Fa.FaChevronRight />
                </button>
                <button
                  onClick={() => {
                    updateGuiState("workspaceModal", {
                      createWorkspace: false,
                      joinWorkspace: true,
                    });
                  }}
                >
                  Rejoindre un espace de travail
                  <Fa.FaChevronRight />
                </button>
              </main>
            )}
            {guiVisibility.workspaceModal.createWorkspace && (
              <form onSubmit={handleCreateWorkspace}>
                <div>
                  <InputField
                    label="Nom"
                    type="text"
                    theme={theme}
                    value={workspaceName}
                    required={true}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                  />
                </div>
                <div>
                  <InputField
                    label="Description"
                    type="text"
                    theme={theme}
                    value={workspaceDescription}
                    required={true}
                    onChange={(e) => setWorkspaceDescription(e.target.value)}
                  />
                  <Checkbox
                    label={<p>Espace de travail privé</p>}
                    theme={theme}
                    onChange={() => {
                      setWorkspaceIsPrivate(!workspaceIsPrivate);
                    }}
                  />
                </div>
                <div>
                  <Button type="submit" text="Créer" theme={theme} />
                </div>
              </form>
            )}
            {guiVisibility.workspaceModal.joinWorkspace && (
              <form onSubmit={handleJoinWorkspace}>
                <div>
                  <InputField
                    label="Lien d'invitation ou token"
                    type="text"
                    theme={theme}
                    value={workspaceInvitation}
                    required={true}
                    onChange={(e) => setWorkspaceInvitation(e.target.value)}
                  />
                </div>
                <div>
                  <Button type="submit" text="Rejoindre" theme={theme} />
                </div>
              </form>
            )}
          </div>
        }
      />
      <Popup
        ref={popupRefs.profile}
        theme={theme}
        display={popupVisibility.profile}
        content={
          <div>
            <header></header>
            <main>
              <button
                onClick={() => {
                  navigate("/login", { state: { logout: true } });
                }}
              >
                Deconnexion
              </button>
            </main>
            <footer></footer>
          </div>
        }
        bottom={105}
        left={185}
      />
      <Popup
        ref={popupRefs.pinned}
        theme={theme}
        display={popupVisibility.pinned}
        content={
          <div>
            <header></header>
            <main>
              <p>Messages épinglés</p>
            </main>
            <footer></footer>
          </div>
        }
        top={mousePosition && mousePosition.y}
        left={mousePosition && mousePosition.x}
      />
      <Popup
        ref={popupRefs.notifications}
        theme={theme}
        display={popupVisibility.notifications}
        content={
          <div>
            <header></header>
            <main>
              <p>Notifications</p>
            </main>
            <footer></footer>
          </div>
        }
        top={mousePosition && mousePosition.y}
        left={mousePosition && mousePosition.x}
      />
      <Popup
        ref={popupRefs.emojis}
        theme={theme}
        display={popupVisibility.emojis}
        content={
          <div>
            <header></header>
            <main>
              <p>Emojis</p>
            </main>
            <footer></footer>
          </div>
        }
        top={mousePosition && mousePosition.y - 60}
        left={mousePosition && mousePosition.x}
      />
      <Popup
        ref={popupRefs.workspace}
        theme={theme}
        display={popupVisibility.workspace}
        content={
          <div>
            <header></header>
            <main>
              <p>Configuration de l'espace de travail</p>
            </main>
            <footer></footer>
          </div>
        }
        top={100}
        left={127}
      />
      <div
        className="dashboard-left"
        style={{ display: !guiVisibility.leftPanel && "none" }}
      >
        <div className="dashboard-left-workspaces">
          <div className="dashboard-left-workspaces-icons">
            {workspaces &&
              Object.values(workspaces).map((workspace) => (
                <button
                  key={workspace.id}
                  title={workspace.name}
                  onClick={() => {
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
                      display:
                        selectedWorkspace.id !== workspace.id ? "none" : "",
                    }}
                  ></span>
                </button>
              ))}
          </div>
          <div className="dashboard-left-workspaces-buttons">
            <button
              onClick={(event) => {
                event.stopPropagation();
                updateGuiState("workspaceModal", {
                  createWorkspace: false,
                  joinWorkspace: false,
                });
                updateModalState("workspace", true);
              }}
              title="Ajouter/Rejoindre un espace de travail"
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
        </div>
        <div className="dashboard-left-content">
          {selectedWorkspace.id && (
            <header>
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  hideAllPopup();
                  updatePopupState("workspace", true);
                  setMousePosition({
                    x: event.clientX,
                    y: event.clientY,
                  });
                }}
              >
                <p>{selectedWorkspace.name}</p>
                <Fa.FaChevronDown />
              </div>
            </header>
          )}
          <main></main>
          <footer>
            <div
              onClick={(event) => {
                event.stopPropagation();
                hideAllPopup();
                updatePopupState("profile", true);
                setMousePosition({
                  x: event.clientX,
                  y: event.clientY,
                });
              }}
              className="dashboard-left-footer-profile"
              title="Menu de profil"
            >
              <div
                style={{
                  background: getBackground(user && user.username),
                  color: getForeground(user && user.username),
                }}
              >
                {user && user.username[0].toUpperCase()}
              </div>
              <p>{user && user.username}</p>
            </div>
            <div className="dashboard-left-footer-buttons">
              <button
                onClick={() => {
                  navigate("/settings");
                }}
                title="Paramètres utilisateur"
              >
                <Fa.FaGear />
              </button>
            </div>
          </footer>
        </div>
      </div>
      {selectedWorkspace.id && !guiVisibility.discoverWorkspaces && (
        <div className="dashboard-right">
          <div className="dashboard-right-content">
            <header>
              <div className="dashboard-right-header-buttons">
                <button
                  onClick={() => {
                    updateGuiState("leftPanel", !guiVisibility.leftPanel);
                  }}
                  title="Afficher/Masquer le panneau de gauche"
                >
                  <Fa.FaBars />
                </button>
              </div>
              <div className="dashboard-right-header-buttons">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    hideAllPopup();
                    updatePopupState("pinned", true);
                    setMousePosition({
                      x: event.clientX,
                      y: event.clientY,
                    });
                  }}
                  title="Mess(ages épinglés"
                >
                  <Fa.FaThumbtack />
                </button>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    hideAllPopup();
                    updatePopupState("notifications", true);
                    setMousePosition({
                      x: event.clientX,
                      y: event.clientY,
                    });
                  }}
                  title="Notifications"
                >
                  <Fa.FaBell />
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem(
                      "gui.dashboard.show_user_list",
                      !guiVisibility.userList
                    );
                    updateGuiState("userList", !guiVisibility.userList);
                  }}
                  title="Afficher/Masquer la liste des utilisateur"
                >
                  <Fa.FaUserGroup />
                </button>
              </div>
            </header>
            <main></main>
            <footer>
              <div className="dashboard-right-footer-buttons">
                <button title="Uploader un fichier">
                  <Fa.FaCirclePlus />
                </button>
              </div>
              <input type="text" placeholder="Envoyer un message" />
              <div className="dashboard-right-footer-buttons">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    hideAllPopup();
                    updatePopupState("emojis", true);
                    setMousePosition({
                      x: event.clientX,
                      y: event.clientY,
                    });
                  }}
                  title="Insérer un émoji"
                >
                  <Fa.FaFaceSmile />
                </button>
              </div>
            </footer>
          </div>
          <div
            className="dashboard-right-peoples"
            style={{ display: !guiVisibility.userList && "none" }}
          ></div>
        </div>
      )}
      {!selectedWorkspace.id && !guiVisibility.discoverWorkspaces && (
        <div className="dashboard-right">
          <p>Aucun espace de travail sélectionné</p>
        </div>
      )}
      {guiVisibility.discoverWorkspaces && (
        <div className="dashboard-right">
          <div className="dashboard-right-content">
            <header>
              <div className="dashboard-right-header-buttons">
                <button
                  onClick={() => {
                    updateGuiState("leftPanel", !guiVisibility.leftPanel);
                  }}
                  title="Afficher/Masquer le panneau de gauche"
                >
                  <Fa.FaBars />
                </button>
              </div>
              <p>Découvrir de nouveaux espaces de travail</p>
              <div className="dashboard-right-header-buttons">
                <button
                  onClick={() => {
                    updateGuiState("discoverWorkspaces", false);
                  }}
                  title="Fermer"
                >
                  <Fa.FaXmark />
                </button>
              </div>
            </header>
            <main></main>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
