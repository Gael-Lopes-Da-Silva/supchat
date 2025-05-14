import React, { useEffect, useState, useRef } from 'react';
import socket from '../../socket';
import HeaderButtons from "./HeaderButtons";
import * as Fa from "react-icons/fa6";
import { getUserChannelIds } from '../../services/Channels';

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
    messages
}) => {
    const [input, setInput] = useState('');
    const [channelMembers, setChannelMembers] = useState([]);
    const [messageSearchTerm, setMessageSearchTerm] = useState('');
    const [mentionSuggestions, setMentionSuggestions] = useState([]);
    const [showMentions, setShowMentions] = useState(false);
    const contextMenuRef = useRef(null);
    const messagesEndRef = useRef(null);

    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        user: null,
    });


    useEffect(() => {
        const fetchChannelMembers = async () => {
            if (!selectedChannel?.id || !selectedChannel?.is_private) return;
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}channels/members?channel_id=${selectedChannel.id}`);
                const data = await res.json();
                if (data.result) setChannelMembers(data.result);
            } catch (err) {
                console.error("Erreur chargement membres du canal:", err);
            }
        };
        fetchChannelMembers();
    }, [selectedChannel?.id]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
                setContextMenu(prev => ({ ...prev, visible: false }));
            }
        };
        window.addEventListener("mousedown", handleClickOutside);
        return () => window.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = () => {
        if (input.trim() && selectedChannel?.id && user?.id) {
            socket.emit('sendMessage', {
                user_id: user.id,
                content: input,
                channel_id: selectedChannel.id
            });
            setInput('');
        }
    };

    const inviteUserToChannel = (targetUserId, channelId) => {
        socket.emit("inviteToChannel", {
            channel_id: channelId,
            user_id: targetUserId,
            inviter_id: user.id
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    const filteredMessages = messages.filter(msg =>
        msg.content.toLowerCase().includes(messageSearchTerm.toLowerCase())
    );

    const renderMessageContent = (text) => {
        return text.split(/(@[\wÀ-ÿ.'\- ]+|#[\wÀ-ÿ0-9._-]+)/g).map((part, index) => {
            if (part.startsWith('@')) {
                return <span key={index} className="mention">{part}</span>;
            }
            if (part.startsWith('#')) {
                const channelName = part.slice(1).toLowerCase();
                const channel = Object.values(channels).find(c => c.name.toLowerCase() === channelName);
                if (channel) {
                    return (
                        <span
                            key={index}
                            className="hashtag"
                            onClick={() => setSelectedChannel(channel)}
                            style={{ cursor: 'pointer', color: '#007bff' }}
                        >
                            {part}
                        </span>
                    );
                }
            }
            return <span key={index}>{part}</span>;
        });
    };

    const handleMentionClick = (username) => {
        const updated = input.replace(/@[\wÀ-ÿ.'\- ]*$/, `@${username} `);
        setInput(updated);
        setShowMentions(false);
    };

    return (
        <div className="dashboard-right">
            <div className="dashboard-right-content">
                <header className="dashboard-header">
                    <HeaderButtons
                        guiVisibility={guiVisibility}
                        updateGuiState={updateGuiState}
                        hideAllPopup={hideAllPopup}
                        updatePopupState={updatePopupState}
                        setMousePosition={setMousePosition}
                        notifications={notifications}
                    />
                    <h2 className="channel-title">
                        {selectedChannel?.name ? `#${selectedChannel.name}` : "Aucun canal sélectionné"}
                    </h2>
                </header>

                <main>
                    {selectedWorkspace.id && selectedChannel?.id ? (
                        <div className="chat-container">
                            <input
                                type="text"
                                placeholder="Rechercher un message..."
                                value={messageSearchTerm}
                                onChange={(e) => setMessageSearchTerm(e.target.value)}
                                className="message-search-input"
                            />
                            <div className="chat-messages">
                                {filteredMessages.length > 0 ? (
                                    filteredMessages.map((msg) => (
                                        <p key={msg.id} className="chat-message">
                                            <strong>{msg.username}:</strong> {renderMessageContent(msg.content)}
                                        </p>
                                    ))
                                ) : (
                                    <p>Aucun message trouvé.</p>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                    ) : hasNoChannels ? (
                        <p>Ce workspace n’a pas encore de canaux. Créez-en un pour démarrer la discussion !</p>
                    ) : (
                        <p className='noChannelYet'>Sélectionnez un canal ou créez en un pour voir les messages.</p>
                    )}
                </main>

                {selectedChannel?.id && (
                    <footer>
                        <div className="dashboard-right-footer-buttons">
                            <button title="Uploader un fichier" disabled={!selectedChannel?.id}>
                                <Fa.FaCirclePlus />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    hideAllPopup();
                                    updatePopupState("emojis", true);
                                    setMousePosition({ x: e.clientX, y: e.clientY });
                                }}
                                title="Insérer un émoji"
                                disabled={!selectedChannel?.id}
                            >
                                <Fa.FaFaceSmile />
                            </button>
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
                                        <li key={u.user_id} onClick={() => handleMentionClick(u.username)}>
                                            @{u.username}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <button onClick={sendMessage} className="send-button" disabled={!selectedChannel?.id}>
                                Envoyer
                            </button>
                        </div>
                    </footer>
                )}
            </div>

            <div className="dashboard-right-peoples" style={{ display: !guiVisibility.userList && "none" }}>
                <h4>Utilisateurs connectés à Supchat</h4>
                {workspaceUsers.length > 0 ? (
                    <ul>
                        {workspaceUsers.map((u) => {
                            const isConnected = connectedUsers.some(cu => cu.id === u.user_id);
                            return (
                                <li key={u.id}>
                                    <button
                                        className="user-button"
                                        onClick={async (e) => {
                                            if (u.user_id === user.id) return;
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            let x = rect.right + 5;
                                            let y = rect.top;
                                            const menuWidth = 180;
                                            const menuHeight = 100;
                                            if (x + menuWidth > window.innerWidth) x = rect.left - menuWidth - 5;
                                            if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 10;

                                            const channelIds = await getUserChannelIds(u.user_id, selectedWorkspace.id);
                                            setContextMenu({
                                                visible: true,
                                                x,
                                                y,
                                                user: u,
                                                channelIds,
                                            });
                                        }}
                                    >
                                        {isConnected ? '🟢' : '⚪'} {u.username}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>Aucun utilisateur dans ce workspace.</p>
                )}

                {contextMenu.visible && (
                    <div
                        ref={contextMenuRef}
                        className="user-context-menu"
                        style={{ position: "absolute", top: contextMenu.y, left: contextMenu.x }}
                    >
                        {(() => {
                            const availableChannels = Object.values(channels)
                                .filter(c => c.is_private && c.user_id === user.id && !contextMenu.channelIds?.includes(Number(c.id)));

                            if (availableChannels.length === 0) {
                                return <p>{contextMenu.user.username} est déjà membre de tous vos canaux privés.</p>;
                            }

                            return (
                                <>
                                    <p>Inviter {contextMenu.user.username} dans :</p>
                                    {availableChannels.map(c => (
                                        <button
                                            key={c.id}
                                            onClick={() => {
                                                inviteUserToChannel(contextMenu.user.user_id, c.id);
                                                setContextMenu(prev => ({ ...prev, visible: false }));
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
                            {channelMembers.map(member => (
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