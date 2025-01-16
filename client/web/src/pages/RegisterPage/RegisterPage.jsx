import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import Checkbox from "../../components/Checkbox/Checkbox";
import Link from "../../components/Link/Link";
import logo from "../../assets/logo.png";
import { createUser, confirmUserEmail } from "../../services/Users";

import "./RegisterPage.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [theme, setTheme] = useState("light");

  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");

    if (token) {
        confirmUserEmail(token)
            .then((response) => {
                if (response.error === 0) {
                    toast.success(response.message, { position: "top-center" });
                } else {
                    toast.error("La confirmation a échoué. Réessayez.", { position: "top-center" });
                }
            })
            .catch(() => {
                toast.error("Erreur lors de la confirmation de l'email.", { position: "top-center" });
            })
            .finally(() => {
                navigate("/login");
            });
    }

    if (localStorage.getItem("user")) {
        navigate("/dashboard");
    }

    const savedTheme = localStorage.getItem("gui.theme");
    if (savedTheme) {
        setTheme(savedTheme);
    }
}, [navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const data = await createUser({ username, email, password });

        if (data.error !== 0) {
            switch (data.error) {
                case 4:
                    toast.error("Ce pseudo est déjà utilisé par un autre utilisateur.", {
                        position: "top-center",
                    });
                    break;

                case 5:
                    toast.error("Cette e-mail est déjà utilisé par un autre utilisateur.", {
                        position: "top-center",
                    });
                    break;

                default:
                    toast.error("Une erreur est survenue lors de l'inscription.", {
                        position: "top-center",
                    });
            }
            return;
        }

        setUsername("");
        setEmail("");
        setPassword("");
        setChecked(false);

        toast.success("Votre compte a été créé. Veuillez vérifier votre boîte mail pour confirmer votre adresse email avant de vous connecter.", {
            position: "top-center",
        });

        navigate("/login");
    } catch (err) {
        console.error("Erreur inconnue lors de l'inscription :", err);
        toast.error("Une erreur inattendue est survenue.", { position: "top-center" });
    }
};


  return (
    <div className={`register-container ${theme}`}>
      <a
        className="register-logo"
        href="/"
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <img src={logo} alt="Supchat logo" />
        <p>Supchat</p>
      </a>
      <div className="register-box">
        <h1>Création d'un compte</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <InputField
              label="Pseudo"
              error="*"
              theme={theme}
              type="text"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <InputField
              label="Email"
              error="*"
              theme={theme}
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <InputField
              label="Mot de passe"
              error="*"
              theme={theme}
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <Checkbox
              theme={theme}
              onChange={() => setChecked(!checked)}
              label={
                <p>
                  J'ai lu et j'accepte les{" "}
                  <Link
                    text="conditions d'utilisation"
                    onClick={() => navigate("/terms")}
                  />{" "}
                  et la{" "}
                  <Link
                    text="politique de confidentialité"
                    onClick={() => navigate("/privacy")}
                  />{" "}
                  de Supchat.
                </p>
              }
            />
          </div>
          <div>
            <Button
              type="submit"
              text="S'enregistrer"
              theme={theme}
              disabled={!checked}
            />
            <p>
              Déjà un compte ?{" "}
              <Link
                text="Se connecter maintenant !"
                onClick={() => navigate("/login")}
              />
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
