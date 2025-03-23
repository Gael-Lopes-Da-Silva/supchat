import React, { useEffect, useState, useRef } from 'react';
import socket from '../../socket';
import HeaderButtons from "./HeaderButtons";
import * as Fa from "react-icons/fa6";

const DashboardRight = ({
    selectedWorkspace,
    selectedChannel,
    user,
    guiVisibility,
    updateGuiState,
    hideAllPopup,
    updatePopupState,
    setMousePosition,
    connectedUsers
}) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Reset tout à chaque changement de workspace
        if (selectedWorkspace.id) {
            socket.emit('joinWorkspace', selectedWorkspace.id);

            // delete les msg en cours quand on change de workspace
            setMessages([]);

            if (selectedChannel.id) {
                socket.emit('joinChannel', selectedChannel.id);
            }
        }
    }, [selectedWorkspace.id, selectedChannel.id]);


    useEffect(() => {
        if (selectedChannel.id) {
            console.log(`User switched to channel: ${selectedChannel.id}`);
            socket.emit('joinChannel', selectedChannel.id);

            // delete les msg en cours quand on change de channel
            setMessages([]);

            socket.on('receiveMessages', (response) => {
                console.log('Received messages:', response);
                setMessages(Array.isArray(response) ? response : []);
            });

            socket.on('receiveMessage', (message) => {
                console.log('Received new message:', message);
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            return () => {
                socket.off('receiveMessages');
                socket.off('receiveMessage');
            };
        }
    }, [selectedChannel.id]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = () => {
        if (input.trim() && selectedChannel.id && user.id) {
            const message = {
                user_id: user.id,
                content: input,
                channel_id: selectedChannel.id
            };

            console.log('Message sent:', message);

            socket.emit('sendMessage', message);
            setInput('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="dashboard-right">
            <div className="dashboard-right-content">
                <header>
                    <HeaderButtons
                        guiVisibility={guiVisibility}
                        updateGuiState={updateGuiState}
                        hideAllPopup={hideAllPopup}
                        updatePopupState={updatePopupState}
                        setMousePosition={setMousePosition}
                    />
                </header>
                <main>
                    {selectedWorkspace.id && selectedChannel.id ? (
                        <div className="chat-container">
                            <div className="chat-messages">
                                {messages.length > 0 ? (
                                    messages.map((msg) => (
                                        <p key={msg.id} className="chat-message">
                                            <strong>{msg.username}:</strong> {msg.content}
                                        </p>
                                    ))
                                ) : (
                                    <p>Pas encore de message ici.</p>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                    ) : (
                        <p>Sélectionnez un canal pour voir les messages.</p>
                    )}
                </main>
                <footer>
                    <div className="dashboard-right-footer-buttons">
                        <button title="Uploader un fichier">
                            <Fa.FaCirclePlus />
                        </button>
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
                    <div className="chat-input-container">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ecrire un message..."
                            className="chat-input"
                            onKeyDown={handleKeyPress}
                        />
                        <button onClick={sendMessage} className="send-button">Envoyer</button>
                    </div>
                </footer>
            </div>
            <div
                className="dashboard-right-peoples"
                style={{ display: !guiVisibility.userList && "none" }}
            >
                <div
                    className="dashboard-right-peoples"
                    style={{ display: !guiVisibility.userList && "none" }}
                >
                    <h4>Utilisateurs connectés</h4>
                    <ul>
                        {connectedUsers.map((u) => (
                            <li key={u.id}>🟢 {u.username}</li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default DashboardRight;
