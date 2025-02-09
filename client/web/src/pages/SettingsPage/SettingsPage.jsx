import * as react from "react";
import * as reactdom from "react-router-dom";
import { FaGoogle, FaFacebook, FaTimes } from "react-icons/fa";

import "./SettingsPage.css";

const SettingsPage = () => {
  const [user, setUser] = react.useState(null);
  const [theme, setTheme] = react.useState(localStorage.getItem("gui.theme") ?? "light");
  const [isGoogleLinked, setIsGoogleLinked] = react.useState(false);
  const [isFacebookLinked, setIsFacebookLinked] = react.useState(false);
  const [forceRender, setForceRender] = react.useState(0);

  const navigate = reactdom.useNavigate();

  react.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorMessage = urlParams.get("error");

    if (errorMessage) {
      alert(errorMessage);
    }

    const storedUser = JSON.parse(localStorage.getItem("user"))?.data || null;
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
        .catch((err) => console.error(" erreur de fetching des providers :", err));
    }
  }, []);

  const handleLinkProvider = (provider) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    if (!token) {
      alert("Vous devez être connecté pour lier un compte.");
      return;
    }

    window.location.href = `http://localhost:3000/users/auth/${provider}/link?token=${token}`;
  };

  const handleUnlinkProvider = async (provider) => {
    if (!user?.id) return;

    const confirmUnlink = window.confirm(`Voulez-vous vraiment délier votre compte ${provider} ?`);
    if (!confirmUnlink) return;

    try {
      const response = await fetch("http://localhost:3000/users/unlink-provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, provider }),
      });

      const data = await response.json();

      if (data.success) {
        if (provider === "google") {
          setIsGoogleLinked(false);
        } else if (provider === "facebook") {
          setIsFacebookLinked(false);
        }

        setForceRender((prev) => prev + 1);
      } else {
        alert("Erreur de déliaison : " + data.error);
      }
    } catch (error) {
      console.error("Erreur de déliaison:", error);
    }
  };

  return (
    <div className={`settings-container ${theme}`} key={forceRender}>
      <div className="settings-left">
        <div className="settings-left-categorie">
          <p>Paramètre utilisateur</p>
          <hr />
          <div className="settings-left-categorie-buttons">
            <button onClick={() => navigate("/dashboard")}>Mon compte</button>
          </div>
        </div>
      </div>

      <div className="settings-right">
        <header>
          <p>Mon compte</p>
          <div className="settings-right-header-buttons">
            <button onClick={() => navigate("/dashboard")} title="Fermer les paramètres">
              <FaTimes />
            </button>
          </div>
        </header>

        <main>
          {user && (
            <div className="settings-link-providers">
              <>
                {user.provider === null && (
                  <>
                    {isGoogleLinked ? (
                      <div className="linked-provider">
                        <button className="google-btn linked">
                          <FaGoogle /> Compte Google lié ✅
                        </button>
                        <button onClick={() => handleUnlinkProvider("google")} className="unlink-btn">
                          ❌ Délier
                        </button>
                      </div>
                    ) : (
                      !isFacebookLinked && (
                        <button onClick={() => handleLinkProvider("google")} className="google-btn">
                          <FaGoogle /> Lier mon compte Google
                        </button>
                      )
                    )}

                    {isFacebookLinked ? (
                      <div className="linked-provider">
                        <button className="facebook-btn linked">
                          <FaFacebook /> Compte Facebook lié ✅
                        </button>
                        <button onClick={() => handleUnlinkProvider("facebook")} className="unlink-btn">
                          ❌ Délier
                        </button>
                      </div>
                    ) : (
                      !isGoogleLinked && (
                        <button onClick={() => handleLinkProvider("facebook")} className="facebook-btn">
                          <FaFacebook /> Lier avec Facebook
                        </button>
                      )
                    )}
                  </>
                )}
              </>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
