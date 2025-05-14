import { useEffect } from 'react';
import { readWorkspaceMember } from "../services/WorkspaceMembers";
const useSocketEvents = ({
   socket,
    selectedWorkspace,
    selectedChannel,
    setChannels,
    setSelectedChannel,
    setWorkspaceUsers,
    pushNotification,
    setJoinedUsername,
    updatePopupState,
    onJoinSuccess,
    setChannelToSelect,
    user,
    setMessages,
    notificationSoundRef,
    setConnectedUsers,         
    handleNewPublicWorkspace,
}) => {

  // Lorsqu’un nouveau canal est créé (event socket),
  // on l’ajoute localement si c’est dans le workspace courant, puis on le sélectionne.
  useEffect(() => {
    const handleChannelCreated = (newChannel) => {
      if (newChannel?.workspace_id !== selectedWorkspace?.id) return;

      setChannels(prev => ({
        ...prev,
        [newChannel.id]: newChannel,
      }));

      socket.emit("joinChannel", {
        channel_id: newChannel.id,
        workspace_id: newChannel.workspace_id,
      });

      setSelectedChannel(newChannel);
    };

    socket.on("channelCreatedSuccess", handleChannelCreated);
    return () => socket.off("channelCreatedSuccess", handleChannelCreated);
  }, [selectedWorkspace?.id, socket]);

  // On listen l'event "channelJoined" et met à jour les channels
  useEffect(() => {
    const handleChannelJoined = ({ channel }) => {
      if (!channel) return;

      setChannels(prev => ({
        ...prev,
        [channel.id]: channel,
      }));

      setSelectedChannel(channel);
      setChannelToSelect(null);
    };

    socket.on("channelJoined", handleChannelJoined);
    return () => socket.off("channelJoined", handleChannelJoined);
  }, [selectedWorkspace?.id, socket]);

  // Notification quand un autre membre rejoint le workspace
  useEffect(() => {
    const handleUserJoined = async ({ workspace_id, username }) => {
      setJoinedUsername(username);
      updatePopupState("joinedNotification", true);

      // Si c’est le workspace actif -> on refetch les membres
      if (selectedWorkspace.id === workspace_id) {
        try {
          const res = await readWorkspaceMember({ workspace_id });
          if (res?.result) {
            setWorkspaceUsers(res.result);
          }
        } catch (err) {
          console.error("Erreur mise à jour membres :", err);
        }
      }

      setTimeout(() => {
        updatePopupState("joinedNotification", false);
      }, 3000);
    };

    socket.on("workspaceUserJoined", handleUserJoined);
    return () => socket.off("workspaceUserJoined", handleUserJoined);
  }, [selectedWorkspace?.id, socket]);


    useEffect(() => {
        socket.on("publicWorkspaceCreated", handleNewPublicWorkspace);
        return () => {
            socket.off("publicWorkspaceCreated", handleNewPublicWorkspace);
        };
    }, [handleNewPublicWorkspace]);

  // Petit popup quand on reçoit une invitation à un channel privé
  useEffect(() => {
    const handleInvitation = ({ channel_name, inviter, channel_id, workspace_id }) => {
      pushNotification({
        type: "channelInvitation",
        message: `${inviter} vous a ajouté dans le canal privé #${channel_name}`,
        channelId: channel_id,
        workspaceId: workspace_id,
      });

      try {
        document.querySelector('audio')?.play();
      } catch (err) {
        console.warn("Erreur lecture son :", err);
      }
    };

    socket.on("channelInvitation", handleInvitation);
    return () => socket.off("channelInvitation", handleInvitation);
  }, [pushNotification, socket]);

  // Réception du workspace + channels après un join
  useEffect(() => {
    socket.on("joinWorkspaceSuccess", onJoinSuccess);
    return () => socket.off("joinWorkspaceSuccess", onJoinSuccess);
  }, [onJoinSuccess, socket]);

  // Initial messages
  useEffect(() => {
  const handleInitialMessages = (msgs) => {
    setMessages(Array.isArray(msgs) ? msgs : []);
  };

  socket.on("receiveMessages", handleInitialMessages);

  return () => {
    socket.off("receiveMessages", handleInitialMessages);
  };
}, [socket, setMessages]); // effet stable, installé une fois


    // MAJ des users connectés à supchat
    useEffect(() => {
        socket.on("connectedUsers", (users) => {
            setConnectedUsers(users);
        });

        return () => {
            socket.off("connectedUsers");
        };
    }, []);

    // Quand un workspace public est créé,
    //on fait join automatiquement car je veux une sorte de mode "suivre tout ce qui se passe" en live
    useEffect(() => {
        const handleWorkspaceCreated = (newWorkspace) => {
            if (!newWorkspace || !newWorkspace.id) {
                console.warn("workspaceCreated reçu mais invalide :", newWorkspace);
                return;
            }

            socket.emit("joinWorkspace", { workspace_id: newWorkspace.id });
        };

        socket.on("workspaceCreated", handleWorkspaceCreated);

        return () => {
            socket.off("workspaceCreated", handleWorkspaceCreated);
        };
    }, []);

useEffect(() => {
  if (selectedChannel?.id && selectedWorkspace?.id) {
    socket.emit("joinChannel", {
      channel_id: selectedChannel.id,
      workspace_id: selectedWorkspace.id,
    });
  }
}, [selectedChannel?.id, selectedWorkspace?.id, socket]);

  // Message en temps réel
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      const isMentioned = Array.isArray(message.mentioned_user_ids) &&
        message.mentioned_user_ids.includes(user.id);

      const isForOtherChannel = message.channel_id !== selectedChannel?.id ||
        message.workspace_id !== selectedWorkspace?.id;

      const isOwnMessage = message.user_id === user.id;

      if (isForOtherChannel && !isOwnMessage) {
        pushNotification({
          type: isMentioned ? "mention" : "message",
          message: isMentioned
            ? `Mention dans #${message.channel_name} par ${message.username}`
            : `Message de ${message.username} dans #${message.channel_name} (${message.workspace_name})`,
          channelId: message.channel_id,
          workspaceId: message.workspace_id,
        });

        notificationSoundRef?.current?.play().catch(err => {
          console.warn("Playback failed:", err);
        });
      }

      if (!isForOtherChannel) {
        setMessages(prev => {
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => socket.off("receiveMessage", handleReceiveMessage);
  }, [selectedChannel?.id, selectedWorkspace?.id, user?.id, pushNotification, notificationSoundRef, socket]);

  // Résultat d'invitation à un canal
  useEffect(() => {
    const handleSuccess = () => alert("Utilisateur invité !");
    const handleError = (error) => alert("Erreur : " + error.message);

    socket.on("inviteToChannelSuccess", handleSuccess);
    socket.on("inviteToChannelError", handleError);

    return () => {
      socket.off("inviteToChannelSuccess", handleSuccess);
      socket.off("inviteToChannelError", handleError);
    };
  }, [socket]);
};



export default useSocketEvents;
