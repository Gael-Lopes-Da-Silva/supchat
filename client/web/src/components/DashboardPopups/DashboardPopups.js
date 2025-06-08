import React from "react";
import Popup from "../Popup/Popup";

const DashboardPopups = ({
  refs,
  visibility,
  theme,
  mousePosition,
  joinedUsername,
  onLogout,
  notifications,
  handleClickNotification,
  handleRemoveNotification
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
          <div className="notifications-popup">
            <header><strong>Notifications</strong></header>
            <main>
              {notifications.length === 0 ? (
                <p>Aucune notification.</p>
              ) : (
                
                <ul>
                  {notifications.map((notif, index) => (
                   <li
                   key={index}
                   className={`notification-item ${notif.read ? 'notification-read' : ''}`}
                 >
                   <span onClick={() => handleClickNotification(index, notif)}>
                     {notif.message}
                   </span>
                   <button
                     className="notification-remove"
                     onClick={(e) => {
                       e.stopPropagation();
                       handleRemoveNotification(index);
                     }}
                     title="Supprimer"
                   >
                     ✖
                   </button>
                 </li>
                 

                  ))}

                </ul>
              )}
            </main>
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
                <strong>{joinedUsername}</strong> a rejoint ce workspace ! 
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

    </>
  );
};

export default DashboardPopups;
