import React from "react";
import Popup from "../Popup/Popup";

const DashboardPopups = ({
  refs,
  visibility,
  theme,
  mousePosition,
  joinedUsername,
  onLogout,
}) => {
  return (
    <>
      <Popup
        ref={refs.profile}
        theme={theme}
        display={visibility.profile}
        content={
          <div>
            <header></header>
            <main>
              <button onClick={onLogout}>Déconnexion</button>
            </main>
            <footer></footer>
          </div>
        }
        bottom={105}
        left={185}
      />

      <Popup
        ref={refs.pinned}
        theme={theme}
        display={visibility.pinned}
        content={
          <div>
            <header></header>
            <main>
              <p>Messages épinglés</p>
            </main>
            <footer></footer>
          </div>
        }
        top={mousePosition?.y}
        left={mousePosition?.x}
      />

      <Popup
        ref={refs.notifications}
        theme={theme}
        display={visibility.notifications}
        content={
          <div>
            <header></header>
            <main>
              <p>Notifications</p>
            </main>
            <footer></footer>
          </div>
        }
        top={mousePosition?.y}
        left={mousePosition?.x}
      />

      <Popup
        ref={refs.joinedNotification}
        theme={theme}
        display={visibility.joinedNotification}
        content={
          <div>
            <main>
              <p>
                <strong>{joinedUsername}</strong> a rejoint ce workspace ! 🎉
              </p>
            </main>
          </div>
        }
        bottom={100}
        left={200}
      />

      <Popup
        ref={refs.emojis}
        theme={theme}
        display={visibility.emojis}
        content={
          <div>
            <header></header>
            <main>
              <p>Emojis</p>
            </main>
            <footer></footer>
          </div>
        }
        top={mousePosition?.y - 60}
        left={mousePosition?.x}
      />

      <Popup
        ref={refs.workspace}
        theme={theme}
        display={visibility.workspace}
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
    </>
  );
};

export default DashboardPopups;
