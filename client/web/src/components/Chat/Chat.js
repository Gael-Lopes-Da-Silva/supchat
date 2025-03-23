import React, { useEffect, useState } from 'react';
import socket from '../../socket';

const Chat = ({ workspaceId, userId, channelId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        socket.emit('joinChannel', `channel_${channelId}`);

        socket.on('receiveMessages', (response) => {
            setMessages(Array.isArray(response) ? response : []);
        });

        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('receiveMessages');
            socket.off('receiveMessage');
            socket.emit('leaveChannel', `channel_${channelId}`);
        };
    }, [channelId]);

    const sendMessage = () => {
        if (input.trim() && channelId && userId) {
            const message = {
                user_id: userId,
                content: input,
                channel_id: channelId
            };

            socket.emit('sendMessage', message);
            setInput('');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.length > 0 ? (
                    messages.map((msg) => (
                        <p key={msg.id}>
                            {msg.username}: {msg.content} 
                        </p>
                    ))
                ) : (
                    <p>Pas encore de message ici.</p>
                )}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
    
};

export default Chat;
