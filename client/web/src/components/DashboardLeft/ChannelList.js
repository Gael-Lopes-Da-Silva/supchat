import { useState } from 'react';
import * as Fa from "react-icons/fa6"

const ChannelList = ({ channels, setSelectedChannel, selectedChannel, getBackground, getForeground, user }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredChannels = Object.values(channels).filter(channel =>
        channel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-left-channels">
            <input
                type="text"
                placeholder="Rechercher un canal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="channel-search-input"
            />

            {filteredChannels.length > 0 ? (
                filteredChannels.map((channel) => {
                    const isSelected = selectedChannel?.id === channel.id;

                    return (
                        <button
                            key={channel.id}
                            className={`channel-button ${isSelected ? "active-channel" : ""}`}
                            title={channel.name}
                            onClick={() => setSelectedChannel(channel)}
                            style={{
                                fontWeight: isSelected ? "bold" : "normal",
                                position: "relative",
                            }}
                        >
                            <p>
                                {channel.name} {channel.is_private ? <Fa.FaLock className="channel-lock-icon" /> : null}
                            </p>

                            {isSelected && (
                                <span
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        right: "10px",
                                        transform: "translateY(-50%)",
                                        width: "8px",
                                        height: "8px",
                                        borderRadius: "50%",
                                        backgroundColor: "#fff",
                                    }}
                                />
                            )}
                        </button>
                    );
                })
            ) : (
                <p>Aucun canal trouvé</p>
            )}
        </div>
    );
};

export default ChannelList;
