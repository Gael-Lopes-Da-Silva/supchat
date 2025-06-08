import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebook, FaTimes } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";

import socket from "../../socket";
import { toast } from "react-toastify";
import Modal from "../../components/Modal/Modal";

import "./SettingsPage.css";

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(
    localStorage.getItem("gui.theme") ?? "light"
  );
  const [status, setStatus] = useState(
    localStorage.getItem("user.status") ?? "online"
  );
  const [isGoogleLinked, setIsGoogleLinked] = useState(false);
  const [isFacebookLinked, setIsFacebookLinked] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorMessage = urlParams.get("error");
    if (errorMessage) {
      toast.error(errorMessage, { position: "top-center" });
    }

    const storedUser = JSON.parse(localStorage.getItem("user"))?.data;
    setUser(storedUser);

    if (storedUser?.id) {
      fetch(`http://localhost:3000/users/${storedUser.id}/providers`, {
        headers: { Authorization: `Bearer ${storedUser.token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setIsGoogleLinked(data.isGoogleLinked);
          setIsFacebookLinked(data.isFacebookLinked);
        })
        .catch((err) =>
          console.error("Erreur de fetching des providers:", err)
        );
    }
  }, []);

  const handleLinkProvider = (provider) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    if (!token) {
      toast.error("Vous devez être connecté pour lier un compte.", {
        position: "top-center",
      });
      return;
    }
    window.location.href = `http://localhost:3000/users/auth/${provider}/link?token=${token}`;
  };

  const handleUnlinkProvider = async (provider) => {
    if (!user?.id) return;

    if (
      !window.confirm(`Voulez-vous vraiment délier votre compte ${provider} ?`)
    )
      return;

    try {
      const response = await fetch(
        "http://localhost:3000/users/unlink-provider",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id, provider }),
        }
      );

      const data = await response.json();

      if (data.success) {
        if (provider === "google") setIsGoogleLinked(false);
        if (provider === "facebook") setIsFacebookLinked(false);
      } else {
        toast.error(`Erreur de déliaison : ${data.error}`, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Erreur de déliaison:", error);
    }
  };

  const handleExportData = () => {
    if (user?.id) {
      window.location.href = `http://localhost:3000/users/${user.id}/export`;
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    localStorage.setItem("user.status", newStatus);
    socket.emit("updateStatus", { user_id: user.id, status: newStatus });
  };

  const handleSaveChanges = async () => {
    const payload = {};
    if (newUsername) payload.username = newUsername;
    if (newPassword) payload.password = newPassword;

    if (Object.keys(payload).length === 0) {
      toast.warning("Aucune modification à envoyer.", {
        position: "top-center",
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data?.result?.success) {
        toast.success(data.result.message || "Informations mises à jour.", {
          position: "top-center",
        });

        if (newUsername) {
          const updatedUser = { ...user, username: newUsername };
          localStorage.setItem("user", JSON.stringify({ data: updatedUser }));
          setUser(updatedUser);
        }

        setNewUsername("");
        setNewPassword("");
        return true;
      } else {
        toast.error(data?.result?.message, { position: "top-center" });
      }
    } catch (err) {
      toast.error("Erreur de mise à jour", { position: "top-center" });
    }
  };

  return (
    <div className={`settings-container ${theme}`}>
      <div className="settings-left">
        <div className="settings-left-categorie">
          <p>Paramètre utilisateur</p>
        </div>
      </div>

      <div className="settings-right">
        <header>
          <p>Mon compte</p>
          <div className="settings-right-header-buttons">
            <button
              onClick={() => navigate("/dashboard")}
              title="Fermer les paramètres"
            >
              <FaTimes />
            </button>
          </div>
        </header>

        <main>
          {user && (
            <div className="settings-form-group">
              <p>
                <strong>Nom d'utilisateur :  </strong> {user.username}
              </p>
              <p>
                <strong>Email : </strong> {user.email}
              </p>

              <div className="settings-row">
                <label htmlFor="theme">Thème : </label> 
                <select
                  id="theme"
                  value={theme}
                  onChange={(e) => {
                    setTheme(e.target.value);
                    localStorage.setItem("gui.theme", e.target.value);
                  }}
                >
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                </select>
              </div>

              <div className="settings-row">
                <label htmlFor="status">Statut : </label>
                <select
                  id="status"
                  value={status}
                  onChange={handleStatusChange}
                >
                  <option value="online">🟢 En ligne</option>
                  <option value="busy">🔴 Occupé</option>
                  <option value="away">🟡 Absent</option>
                  <option value="offline">⚫ Hors ligne</option>
                </select>
              </div>

              <button onClick={handleExportData}>Exporter mes données</button>

              <hr />

              <button onClick={() => setShowUsernameModal(true)}>
                Modifier le nom d'utilisateur
              </button>

              <button onClick={() => setShowPasswordModal(true)}>
                Modifier le mot de passe
              </button>

              <hr />

              {user.provider === "local" ? (
                <>
                  {!isGoogleLinked && !isFacebookLinked && (
                    <>
                      <button
                        onClick={() => handleLinkProvider("google")}
                        className="google-btn"
                      >
                        <FaGoogle /> Lier mon compte Google
                      </button>
                      <button
                        onClick={() => handleLinkProvider("facebook")}
                        className="facebook-btn"
                      >
                        <FaFacebook /> Lier mon compte Facebook
                      </button>
                    </>
                  )}
                  {isGoogleLinked && (
                    <div className="linked-provider">
                      <button className="google-btn linked">
                        <FaGoogle /> Compte Google lié
                      </button>
                      <button
                        onClick={() => handleUnlinkProvider("google")}
                        className="unlink-btn"
                      >
                        <MdOutlineCancel /> Délier
                      </button>
                    </div>
                  )}

                  {isFacebookLinked && (
                    <div className="linked-provider">
                      <button className="facebook-btn linked">
                        <FaFacebook /> Compte Facebook lié
                      </button>
                      <button
                        onClick={() => handleUnlinkProvider("facebook")}
                        className="unlink-btn"
                      >
                        Délier
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="connectToLocalAcc">
                  Vous êtes connecté via <strong>{user.provider}</strong>.<br />
                  Pour gérer les liaisons de comptes, veuillez vous connecter
                  avec votre identifiant local.
                </div>
              )}
            </div>
          )}
        </main>

        <Modal
          display={showUsernameModal}
          theme={theme}
          title="Modifier le nom d'utilisateur"
          onClose={() => setShowUsernameModal(false)}
          content={
            <div className="settings-field" style={{ marginTop: "1rem" }}>
              <label htmlFor="new-username">Nouveau nom :</label>
              <input
                id="new-username"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Entrer un nouveau nom"
              />
              <button
                disabled={!newUsername.trim()}
                onClick={async () => {
                  const success = await handleSaveChanges();
                  if (success) setShowUsernameModal(false);
                }}
              >
                Enregistrer
              </button>
            </div>
          }
        />

        <Modal
          display={showPasswordModal}
          theme={theme}
          title="Modifier le mot de passe"
          onClose={() => setShowPasswordModal(false)}
          content={
            <div className="settings-field" style={{ marginTop: "1rem" }}>
              <label htmlFor="new-password">Nouveau mot de passe :</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Entrer un nouveau mot de passe"
              />
              <button
                disabled={!newPassword.trim()}
                onClick={async () => {
                  const success = await handleSaveChanges();
                  if (success) setShowPasswordModal(false);
                }}
              >
                Enregistrer
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default SettingsPage;
