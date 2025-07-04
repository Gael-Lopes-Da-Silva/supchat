/* eslint-disable react-hooks/exhaustive-deps */
import "./DashboardRight.css";
import { useEffect, useState, useRef } from "react";
import socket from "../../socket";
import HeaderButtons from "./HeaderButtons";
import * as Fa from "react-icons/fa6";
import EmojiPicker from "emoji-picker-react";
import {
  getUserChannelIds,
  getUsersReactions,
  getChannelMembers,
  uploadFile,
} from "../../services/Channels";
import { toast } from "react-toastify";
import { readUser } from "../../services/Users";
import { deleteWorkspaceMember } from "../../services/WorkspaceMembers";
import { ReactComponent as EmojiIcon } from "../../assets/emoji-round-plus.svg";
import { isSafeUrl } from "../../utils/securityUtils"

const DashboardRight = ({
  selectedWorkspace,
  selectedChannel,
  user,
  guiVisibility,
  updateGuiState,
  hideAllPopup,
  updatePopupState,
  setMousePosition,
  connectedUsers,
  hasNoChannels,
  channels,
  workspaceUsers,
  notifications,
  setSelectedChannel,
  messages,
  channelNotificationPrefs,
  setChannelNotificationPrefs,
  currentUserRoleId,
}) => {
  const [input, setInput] = useState("");
  const [channelMembers, setChannelMembers] = useState([]);
  const [messageSearchTerm, setMessageSearchTerm] = useState("");
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [showMentions, setShowMentions] = useState(false);
  const [activeEmojiPickerMessageId, setActiveEmojiPickerMessageId] =
    useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: "",
  });

  const reactionPickerRefs = useRef({});
  const fileInputRef = useRef(null);

  const contextMenuRef = useRef(null);
  const messagesEndRef = useRef(null);
  const isAdmin = currentUserRoleId === 1;

  const myRoleLabel =
    currentUserRoleId === 1
      ? "Admin"
      : currentUserRoleId === 2
        ? "Membre"
        : currentUserRoleId === 3
          ? "Invité"
          : "";

  const statusIcons = {
    online: "🟢",
    busy: "🔴",
    away: "🟡",
    offline: "⚫",
  };
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    user: null,
  });

  useEffect(() => {
    const fetchAllUsers = async () => {
      const apiUrl = process.env.REACT_APP_API_URL;
      const res = await readUser({}, apiUrl);

      if (!res.error && res.result) {
        // quand on link son compte à un provider, le compte prend le meme id que le provider donc il peut yavoir un doublon au niveau des usernames
        // pour ce call Api, readUser rend un format tel que [{}] donc pour faire plus simple je peux utiliser new Map qui va 
        // ecraser le doublon et rendre une valeur unique.
        const uniqueUsers = Array.from(
          new Map(res.result.map((u) => [u.id, u])).values()
        );

        setAllUsers(uniqueUsers);
      } else {
        toast.error(`Erreur readUser (ligne 84 dashboardRight) : ${res.error}`);
      }
    };

    fetchAllUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const ref = reactionPickerRefs.current[activeEmojiPickerMessageId];
      if (ref && !ref.contains(event.target)) {
        setActiveEmojiPickerMessageId(null);
      }
    };

    if (activeEmojiPickerMessageId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeEmojiPickerMessageId]);

  const fetchUsersForReaction = async (messageId, emoji, x, y) => {
    try {
      const users = await getUsersReactions(messageId, emoji);
      if (users.length > 0) {
        setTooltip({
          visible: true,
          content: `Réaction de ${users.join(", ")}`,
          x,
          y,
        });
      } else {
        setTooltip({ visible: false, content: "", x: 0, y: 0 });
      }
    } catch (err) {
      console.error("Erreur fetch users for reaction:", err);
      setTooltip({ visible: false, content: "", x: 0, y: 0 });
    }
  };

  const handleEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const toggleReaction = (message_id, emoji) => {
    const message = messages.find((msg) => msg.id === message_id);

    const userReacted = message.reactions?.some(
      (r) => r.emoji === emoji && r.user_ids?.includes(user.id)
    );

    if (userReacted) {
      socket.emit("removeReaction", { message_id, user_id: user.id, emoji });
      setTooltip({ visible: false, content: "", x: 0, y: 0 });
    } else {
      socket.emit("addReaction", { message_id, user_id: user.id, emoji });
    }
  };

  const showEmojiPickerFor = (message_id) => {
    setActiveEmojiPickerMessageId(message_id);
  };

  const toggleChannelNotifications = (channelId) => {
    setChannelNotificationPrefs((prev) => {
      const updated = { ...prev };

      // lorsque je vais cliquer sur le bouton, je vais en fait commencer à construire l'objet ChannelnotificationsPrefs
      //  ce sera surement la première fois pour un channel en particulier alors la valeur associé au channelId sera undefined donc on le met
      // on le set à false.
      if (updated[channelId] === undefined) {
        updated[channelId] = false;
      } else {
        // Pour les autres clicks il yaura plus de valeur undefined associé au chan en question donc on inverse l'état actuel
        updated[channelId] = !updated[channelId];
      }

      localStorage.setItem("channelNotificationPrefs", JSON.stringify(updated));

      return updated; // maj
    });
  };

  const getAttachmentUrl = (path) => {
    if (!path) return null;
    const API_URL = process.env.REACT_APP_API_URL?.replace(/\/$/, "");
    const url = path.startsWith("http") ? path : `${API_URL}${path}`;
    return isSafeUrl(url) ? url : null;
  };


  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const fetchChannelMembers = async () => {
      if (!selectedChannel?.id || !selectedChannel?.is_private) return;

      try {
        const data = await getChannelMembers(selectedChannel.id);

        if (data.result) setChannelMembers(data.result);
      } catch (err) {
        console.error("Erreur chargement membres du canal:", err);
      }
    };
    fetchChannelMembers();
  }, [selectedChannel?.id]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedChannel?.id || !user?.id) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("channel_id", selectedChannel.id);
    formData.append("user_id", user.id);

    const data = await uploadFile(formData);

    if (data.error === 0 && data.result?.fileUrl && data.result?.message_id) {
      socket.emit("broadcastAttachedMsg", {
        id: data.result.message_id,
        user_id: user.id,
        username: user.username,
        content: "",
        attachment: data.result.fileUrl,
        channel_id: selectedChannel.id,
        channel_name: selectedChannel.name,
        workspace_id: selectedWorkspace.id,
        workspace_name: selectedWorkspace.name,
        mentioned_user_ids: [],
      });
    } else {
      toast.error(`Erreur upload : ${data.error_messagef}`, {
        position: "top-center",
      });
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);

    const match = val.match(/@([\wÀ-ÿ.'\- ]*)$/i);

    if (match) {
      const query = match[1].toLowerCase().trim();
      const matches = workspaceUsers.filter(
        (u) => u.username.toLowerCase().includes(query) && u.user_id !== user.id
      );
      setMentionSuggestions(matches);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const getFileName = (path) => {
    if (!path) return "";
    return decodeURIComponent(path.split("/").pop());
  };


  const prevMessageCountRef = useRef(0); // compteur reste le meme entre les renders et fais pas de rerender quand elle change

  useEffect(() => {
    // Filter des msg uniquement dans le channel selectionné car j'avais un bug qui faisait que j'avais un scroll down dans un
    // channel où le message n'était pas envoyé mais dans un autre channel
    const currentChannelMessages = messages.filter(
      (msg) => msg.channel_id === selectedChannel?.id
    );
    const currentCount = currentChannelMessages.length;

    if (currentCount > prevMessageCountRef.current) {
      // Nouveau message ajouté -> scroll vers le bas
      // faut laisser le temps au dom de terminer le layout des messages entre chaque selection de channel
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }

    // maj du counter
    prevMessageCountRef.current = currentCount;
  }, [messages, selectedChannel?.id]);

  useEffect(() => {
    const handleClickOutsideContextMenu = (e) => {
      if (
        contextMenu.visible &&
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target)
      ) {
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutsideContextMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideContextMenu);
    };
  }, [contextMenu.visible]);

  const sendMessage = () => {
    if (input.trim() && selectedChannel?.id && user?.id) {
      socket.emit("sendMessage", {
        user_id: user.id,
        content: input,
        channel_id: selectedChannel.id,
      });
      setInput("");
    }
  };

  const inviteUserToChannel = (targetUserId, channelId) => {
    socket.emit("inviteToChannel", {
      channel_id: channelId,
      user_id: targetUserId,
      inviter_id: user.id,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };


  const filteredMessages = messages.filter((msg) => {
    const searchTerm = messageSearchTerm.toLowerCase();

    const isPhoto =
      msg.attachment && msg.attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    const isVideo = msg.attachment && msg.attachment.match(/\.(mp4|webm)$/i);

    return (
      (msg.content && msg.content.toLowerCase().includes(searchTerm)) ||
      (msg.attachment && msg.attachment.toLowerCase().includes(searchTerm)) ||
      (searchTerm === "photos" && isPhoto) ||
      (searchTerm === "videos" && isVideo)
    );
  });

  const filteredUsers = workspaceUsers.filter((u) =>
    u.username.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const renderMessageContent = (text) => {
    return text
      .split(/(@[\wÀ-ÿ.'\- ]+|#[\wÀ-ÿ0-9._-]+)/g)
      .map((part, index) => {
        if (part.startsWith("@")) {
          return (
            <span key={index} className="mention">
              {part}
            </span>
          );
        }
        if (part.startsWith("#")) {
          const channelName = part.slice(1).toLowerCase();
          const channel = Object.values(channels).find(
            (c) => c.name.toLowerCase() === channelName
          );
          if (channel) {
            return (
              <span
                key={index}
                className="hashtag"
                onClick={() => setSelectedChannel(channel)}
                style={{ cursor: "pointer", color: "#007bff" }}
              >
                {part}
              </span>
            );
          }
        }
        return <span key={index}>{part}</span>;
      });
  };
  const handleKickMember = async (workspaceMemberId) => {
    try {
      const res = await deleteWorkspaceMember(workspaceMemberId);

      if (res.error) {
        toast.error("Erreur lors de l'expulsion.", { position: "top-center" });
        return;
      }

      toast.success("Membre expulsé.", { position: "top-center" });
      socket.emit("getWorkspaceMembers", {
        workspace_id: selectedWorkspace.id,
      });
    } catch (err) {
      console.error("Erreur expulsion membre :", err);
      toast.error("Erreur réseau.", { position: "top-center" });
    }
  };

  const handleMentionClick = (username) => {
    const updated = input.replace(/@[\wÀ-ÿ.'\- ]*$/, `@${username} `);
    setInput(updated);
    setShowMentions(false);
  };

  return (
    <div className="dashboard-right">
      <div className="dashboard-right-content">

          <HeaderButtons
            guiVisibility={guiVisibility}
            updateGuiState={updateGuiState}
            hideAllPopup={hideAllPopup}
            updatePopupState={updatePopupState}
            setMousePosition={setMousePosition}
            notifications={notifications}
            selectedChannel={selectedChannel}
            channelNotificationPrefs={channelNotificationPrefs}
            toggleChannelNotifications={toggleChannelNotifications}
            myRoleLabel={myRoleLabel}
          />


        <main>
          {selectedWorkspace.id && selectedChannel?.id ? (
            <div className="chat-container">
              <small className="message-search-hint">
                Astuce : tapez <strong>photos</strong>, <strong>videos</strong>{" "}
                ou <strong>.pdf (par exemple)</strong> pour filtrer par type de
                fichier.
              </small>

              <input
                type="text"
                placeholder="Rechercher un message..."
                value={messageSearchTerm}
                onChange={(e) => setMessageSearchTerm(e.target.value)}
                className="message-search-input"
              />

              <div className="chat-messages">
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((msg) => {
                    const displayedTimestamp =
                      msg.created_at || new Date().toISOString();

                    return (
                      <div
                        key={msg.id}
                        className={`chat-message ${msg.user_id === user.id ? "from-me" : "from-others"
                          }`}
                      >
                        <div className="message-inner">
                          <div className="message-header">
                            <b> {msg.username}</b>
                            <span className="timestamp">
                              {" "}
                              · {formatTimestamp(displayedTimestamp)}
                            </span>
                          </div>

                          <div className="message-text">
                            {renderMessageContent(msg.content)}
                          </div>

                          {msg.attachment && (() => {
                            const url = getAttachmentUrl(msg.attachment);
                            const isSafe = isSafeUrl(url);

                            if (!isSafe) return null;

                            return (
                              <div className="chat-attachment">
                                <a href={url} download target="_blank" rel="noopener noreferrer">
                                  {msg.attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                    <img src={url} alt="uploaded" className="uploaded-image" />
                                  ) : msg.attachment.match(/\.(mp4|webm)$/i) ? (
                                    <video src={url} controls className="uploaded-video" />
                                  ) : (
                                    getFileName(msg.attachment)
                                  )}
                                </a>
                              </div>
                            );
                          })()}


                          <div className="reaction-action">
                            {activeEmojiPickerMessageId !== msg.id &&
                              !msg.reactions?.some((r) =>
                                r.user_ids?.includes(user.id)
                              ) && (
                                <button
                                  onClick={() => showEmojiPickerFor(msg.id)}
                                  className="reaction-add-btn"
                                  title="Ajouter une réaction"
                                >
                                  <EmojiIcon
                                    style={{ width: "15px", height: "20px" }}
                                  />
                                </button>
                              )}
                          </div>

                          <div className="message-reactions">
                            {msg.reactions?.map((r) => (
                              <div
                                key={r.emoji}
                                className="reaction-wrapper"
                                style={{
                                  display: "inline-block",
                                  position: "relative",
                                }}
                                onMouseEnter={(e) => {
                                  const rect =
                                    e.currentTarget.getBoundingClientRect();
                                  fetchUsersForReaction(
                                    msg.id,
                                    r.emoji,
                                    rect.left,
                                    rect.top
                                  );
                                }}
                                onMouseLeave={() =>
                                  setTooltip({
                                    visible: false,
                                    content: "",
                                    x: 0,
                                    y: 0,
                                  })
                                }
                              >
                                <button
                                  onClick={() =>
                                    toggleReaction(msg.id, r.emoji)
                                  }
                                  className="reaction-btn"
                                >
                                  {r.emoji} {r.user_ids?.length || 0}
                                </button>
                              </div>
                            ))}
                          </div>

                          {tooltip.visible && (
                            <div
                              className="reaction-tooltip"
                              style={{ top: tooltip.y, left: tooltip.x }}
                            >
                              {tooltip.content}
                            </div>
                          )}

                          {activeEmojiPickerMessageId === msg.id && (
                            <div
                              className="emoji-picker"
                              ref={(el) =>
                                (reactionPickerRefs.current[msg.id] = el)
                              }
                            >
                              {["❤️", "😂", "👍", "👎", "🔥", "😢", "😡"].map(
                                (emoji) => (
                                  <button
                                    key={emoji}
                                    onClick={() => {
                                      toggleReaction(msg.id, emoji);
                                      setActiveEmojiPickerMessageId(null);
                                    }}
                                  >
                                    {emoji}
                                  </button>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>Aucun message trouvé.</p>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          ) : hasNoChannels ? (
            <p>
              Ce workspace n’a pas encore de canaux. Créez-en un pour démarrer
              la discussion !
            </p>
          ) : (
            <p className="noChannelYet">
              Sélectionnez un canal ou créez en un pour voir les messages.
            </p>
          )}
        </main>

        {selectedChannel?.id && (
          <footer>
            <div className="dashboard-right-footer-buttons">
              <button
                title="Uploader un fichier"
                disabled={!selectedChannel?.id}
                onClick={() => fileInputRef.current?.click()}
              >
                <Fa.FaCirclePlus />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEmojiPicker((prev) => !prev);
                }}
                title="Insérer un émoji"
                disabled={!selectedChannel?.id}
              >
                <Fa.FaFaceSmile />
              </button>
              {showEmojiPicker && (
                <div className="emoji-picker-container">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    autoFocusSearch={false}
                  />
                </div>
              )}
            </div>

            <div className="chat-input-container">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Ecrire un message..."
                className="chat-input"
                onKeyDown={handleKeyPress}
                disabled={!selectedChannel?.id}
              />

              {showMentions && mentionSuggestions.length > 0 && (
                <ul className="mention-suggestions">
                  {mentionSuggestions.map((u) => (
                    <li
                      key={u.user_id}
                      onClick={() => handleMentionClick(u.username)}
                    >
                      @{u.username}
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={sendMessage}
                className="send-button"
                disabled={!selectedChannel?.id}
              >
                Envoyer
              </button>
            </div>
          </footer>
        )}
      </div>
      <div
        className="dashboard-right-peoples"
        style={{ display: !guiVisibility.userList && "none" }}
      >
        <h4>Utilisateurs Supchat connectés</h4>
        <ul>

          {Array.from(
            new Map(
              allUsers
                .filter((u) => connectedUsers.some((cu) => cu.id === u.id))
                .map((u) => [u.username, u]) // key = username pour eviter doublons (au cas où on a lié son compte à un provider car quand on lie un compteà  un provider on prend le meme id et ça affiche l'username connecté en double )
            ).values()
          ).map((u) => {
            const connectedUser = connectedUsers.find((cu) => cu.id === u.id);
            const status = connectedUser ? connectedUser.status : "offline";
            const statusIcon = statusIcons[status];
            return (
              <li key={u.user_id || u.id}>
                {statusIcon} {u.username}
              </li>
            );
          })}

          {allUsers
            .filter((u) => !connectedUsers.some((cu) => cu.id === u.id))
            .map((u) => (
              <li key={u.id} className="user-offline">
                ⚫ {u.username}
              </li>
            ))}
        </ul>

        <h4>
          Membres du workspace (
          {
            filteredUsers.filter((u) =>
              connectedUsers.some((cu) => cu.id === u.user_id)
            ).length
          }
          /{workspaceUsers.length})
        </h4>

        <input
          type="text"
          placeholder="Rechercher un membre..."
          value={userSearchTerm}
          onChange={(e) => setUserSearchTerm(e.target.value)}
          className="user-search-input"
        />
        <ul>
          {filteredUsers.map((u) => {
            const connectedUser = connectedUsers.find(
              (cu) => cu.id === u.user_id
            );
            const isOnline = Boolean(connectedUser);
            const status = connectedUser?.status;
            const statusIcon = isOnline ? statusIcons[status] : "⚫";
            const isNotSelf = u.user_id !== user.id;

            return (
              <li
                key={u.user_id}
                className={`user-list-item ${!isOnline ? "user-offline" : ""}`}
              >
                <div className="user-line">
                  <button
                    className={`user-button ${!isNotSelf ? "self-user" : ""}`}
                    onClick={async (e) => {
                      if (!isNotSelf) return;
                      e.stopPropagation();
                      const rect = e.currentTarget.getBoundingClientRect();
                      let x = rect.right + 5;
                      let y = rect.top;
                      const menuWidth = 180;
                      const menuHeight = 100;

                      if (x + menuWidth > window.innerWidth)
                        x = rect.left - menuWidth - 5;
                      if (y + menuHeight > window.innerHeight)
                        y = window.innerHeight - menuHeight - 10;

                      const channelIds = await getUserChannelIds(
                        u.user_id,
                        selectedWorkspace.id
                      );
                      setContextMenu({
                        visible: true,
                        x,
                        y,
                        user: u,
                        channelIds,
                      });
                    }}
                  >
                    {statusIcon} {u.username}
                  </button>

                  {isAdmin && isNotSelf && (
                    <button
                      title="Expulser ce membre du workspace"
                      onClick={() => handleKickMember(u.id)}
                      className="kick-button"
                    >
                      ❌
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {contextMenu.visible && (
          <div
            ref={contextMenuRef}
            className="user-context-menu"
            style={{
              position: "absolute",
              top: contextMenu.y,
              left: contextMenu.x,
            }}
          >
            {(() => {
              const availableChannels = Object.values(channels).filter(
                (c) =>
                  c.is_private &&
                  c.user_id === user.id &&
                  !contextMenu.channelIds?.includes(Number(c.id))
              );

              if (availableChannels.length === 0) {
                return (
                  <p>
                    {contextMenu.user.username} est déjà membre de tous vos
                    canaux privés ou vous n'avez pas encore de canal privé.
                  </p>
                );
              }

              return (
                <>
                  <p>Inviter {contextMenu.user.username} dans :</p>
                  {availableChannels.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        inviteUserToChannel(contextMenu.user.user_id, c.id);
                        setContextMenu((prev) => ({ ...prev, visible: false }));
                      }}
                    >
                      {c.name}
                    </button>
                  ))}
                </>
              );
            })()}
          </div>
        )}

        {selectedChannel?.is_private && channelMembers.length > 0 ? (
          <div className="channel-members-list">
            <h4>Membres de {selectedChannel.name} (privé)</h4>
            <ul>
              {channelMembers.map((member) => (
                <li key={member.user_id}>👤 {member.username}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DashboardRight;
