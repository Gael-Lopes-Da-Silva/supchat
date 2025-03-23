import React from 'react';

const ChannelList = ({ channels, setSelectedChannel, selectedChannel, getBackground, getForeground }) => {
    return (
        <div className="dashboard-left-channels">
            {channels && Object.values(channels).length > 0 ? (
                Object.values(channels).map((channel) => {
                    const isSelected = selectedChannel?.id === channel.id;

                    return (
                        <button
                            key={channel.id}
                            className={`channel-button ${isSelected ? "active-channel" : ""}`}
                            title={channel.name}
                            onClick={() => setSelectedChannel(channel)}
                            style={{
                                background: getBackground(channel.name),
                                color: getForeground(channel.name),
                                border: isSelected ? "2px solid white" : "1px solid transparent",
                                fontWeight: isSelected ? "bold" : "normal",
                                position: "relative",
                            }}
                        >
                            <p>{channel.name}</p>

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
                <p>Aucun canal disponible</p>
            )}
        </div>
    );
};

export default ChannelList;
