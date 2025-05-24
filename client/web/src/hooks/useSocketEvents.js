/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { readWorkspaceMember } from "../services/WorkspaceMembers";
import { readChannelMember } from "../services/ChannelMembers";

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
  setWorkspaces,
  setSelectedWorkspace,
  workspaces,
  channels
}) => {


  useEffect(() => {
    const handleMessage = (msg) => {
      const sameWorkspace = msg.workspace_id === selectedWorkspace?.id;
      const sameChannel = msg.channel_id === selectedChannel?.id;
      const isOwn = msg.user_id === user.id;
      const isMention = msg.mentioned_user_ids?.includes?.(user.id);

      if (!workspaces?.[msg.workspace_id]) return;

      if (!sameWorkspace || !sameChannel) {
        if (!isOwn) {
          const didNotify = pushNotification({
            type: isMention ? "mention" : "message",
            message: isMention
              ? `Mention dans #${msg.channel_name} par ${msg.username}`
              : `Message de ${msg.username} dans #${msg.channel_name} (${msg.workspace_name})`,
            channelId: msg.channel_id,
            workspaceId: msg.workspace_id,
          });
          if (didNotify) notificationSoundRef.current?.play().catch(console.warn);
        }
      } else {

        setMessages(prev => prev.some(m => m.id === msg.id) ? prev : [...prev, msg]);

      }
    };

    socket.on("receiveMessage", handleMessage);
    return () => socket.off("receiveMessage", handleMessage);
  }, [
    socket,
    workspaces,
    selectedWorkspace?.id,
    selectedChannel?.id,
    user.id,
    pushNotification,
  ]);


  useEffect(() => {

    const handleChannelCreated = (channel) => {
      if (channel?.workspace_id !== selectedWorkspace?.id) return;
      setChannels(prev => ({ ...prev, [channel.id]: channel }));
      socket.emit("joinChannel", { channel_id: channel.id, workspace_id: channel.workspace_id });
      setSelectedChannel(channel);
    };

    const handleChannelJoined = async ({ channel }) => {
      if (!channel) return;

      if (channel.is_private) {
        try {
          const res = await readChannelMember({ channel_id: channel.id });
          if (res?.result) channel.members = res.result;
        } catch (err) { console.error(err); }
      }

      setChannels(prev => ({ ...prev, [channel.id]: channel }));
      setSelectedChannel(channel);
      setChannelToSelect(null);
    };

    const handleUserJoined = async ({ workspace_id, username }) => {
      setJoinedUsername(username);
      updatePopupState("joinedNotification", true);

      // si on est dans ce workspace → maj liste des membres
      if (selectedWorkspace.id === workspace_id) {
        try {
          const res = await readWorkspaceMember({ workspace_id });
          if (res?.result) setWorkspaceUsers(res.result);
        } catch (err) { console.error(err); }
      }

      setTimeout(() => updatePopupState("joinedNotification", false), 3000);
    };




    const handleRoleUpdated = ({ workspace_id, new_role_id }) => {
      if (selectedWorkspace?.id !== workspace_id) return;

      const roleNames = {
        1: "administrateur",
        2: "membre",
        3: "invité"
      };

      const roleLabel = roleNames[new_role_id];

      const notified = pushNotification({
        type: "roleChanged",
        message: `Nouveau rôle : ${roleLabel}`,
        workspaceId: workspace_id,
      });

      if (notified) {
        notificationSoundRef?.current?.play().catch(console.warn);
      }

      setWorkspaceUsers(users =>
        users.map(member => {
          if (member.user_id === user.id && member.workspace_id === workspace_id) {
            return { ...member, role_id: new_role_id };
          }
          return member;
        })
      );
      socket.emit("getWorkspaceMembers", { workspace_id }); // pour refresh les droits du membre upgradé/downgradé

    };


    const handleInitialMessages = (msgs) => {
      setMessages(Array.isArray(msgs) ? msgs : []);
    };

    const handleWorkspaceMembers = (members) => {
      setWorkspaceUsers(members);
    };


    socket.on("channelCreatedSuccess", handleChannelCreated);
    socket.on("channelJoined", handleChannelJoined);
    socket.on("workspaceUserJoined", handleUserJoined);
    socket.on("roleUpdated", handleRoleUpdated);
    socket.on("receiveMessages", handleInitialMessages);
    socket.on("workspaceMembers", handleWorkspaceMembers);
    socket.on("joinWorkspaceSuccess", onJoinSuccess);

    if (!selectedWorkspace?.id) return;
    socket.emit("getWorkspaceMembers", { workspace_id: selectedWorkspace?.id });

    return () => {
      socket.off("channelCreatedSuccess", handleChannelCreated);
      socket.off("channelJoined", handleChannelJoined);
      socket.off("workspaceUserJoined", handleUserJoined);

      socket.off("roleUpdated", handleRoleUpdated);
      socket.off("receiveMessages", handleInitialMessages);
      socket.off("workspaceMembers", handleWorkspaceMembers);
      socket.off("joinWorkspaceSuccess", onJoinSuccess);
    };
  }, [selectedWorkspace?.id, user.id, socket]);


  useEffect(() => {
    const handleKick = ({ workspace_id }) => {
      setSelectedWorkspace({});
      setChannels({});
      setSelectedChannel({});
      setWorkspaceUsers([]);
      setWorkspaces(prev => {
        const updated = { ...prev };
        delete updated[workspace_id];
        return updated;
      });
      alert("Vous avez été expulsé de ce workspace.");
    };

    socket.on("kickedFromWorkspace", handleKick);
    return () => {
      socket.off("kickedFromWorkspace", handleKick);
    };
  }, []);

  useEffect(() => {
    if (selectedWorkspace?.id) {
      socket.emit("joinWorkspace", { workspace_id: selectedWorkspace.id });
    }
  }, [selectedWorkspace?.id]); // autojoin du workspace quon selectionne

  useEffect(() => {
    if (selectedChannel?.id && selectedWorkspace?.id) {
      socket.emit("joinChannel", {
        channel_id: selectedChannel.id,
        workspace_id: selectedWorkspace.id,
      });
    }
  }, [selectedChannel?.id, selectedWorkspace?.id]);
  
  useEffect(() => {
    const handleStatus = ({ user_id, status }) => {
      setConnectedUsers(prev =>
        prev.map(u =>
          u.id === user_id ? { ...u, status } : u
        )
      );
    };

    socket.on("userStatusBroadcast", handleStatus);
    return () => socket.off("userStatusBroadcast", handleStatus);
  }, [socket]);


  useEffect(() => {
    const handleUpdateReactions = ({ message_id, reactions }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === message_id ? { ...msg, reactions } : msg
        )
      );
    };

    const handleReactionNotification = ({ message, message_id, emoji, workspace_id, channel_id }) => {
      pushNotification({
        type: "reaction",
        message,
        messageId: message_id,
        emoji,
        workspaceId: workspace_id,
        channelId: channel_id,
        onClick: () => {
          setSelectedWorkspace(workspaces[workspace_id]);
          setSelectedChannel(channels[channel_id]);
        },
      });
      notificationSoundRef.current?.play().catch(console.warn);
    };

    socket.on("updateReactions", handleUpdateReactions);
    socket.on("reactionNotification", handleReactionNotification);

    return () => {
      socket.off("updateReactions", handleUpdateReactions);
      socket.off("reactionNotification", handleReactionNotification);
    };
  }, [socket, setMessages, pushNotification, notificationSoundRef]);




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
    return () => {
      socket.off("channelInvitation", handleInvitation);
    };
  }, [socket, pushNotification]);


  // affiche le nouveau chan public en live pour les autres membres (pas le createur)
  useEffect(() => {
    if (!selectedWorkspace.id) return;

    socket.emit('joinWorkspace', selectedWorkspace.id);


    const handleChannelCreated = (newChannel) => {

      setChannels((prevChannels) => ({
        ...prevChannels,
        [newChannel.id]: newChannel,
      }));
    };

    socket.on("channelCreated", handleChannelCreated);

    return () => {
      socket.off("channelCreated", handleChannelCreated);
    };
  }, [selectedWorkspace.id]);


  useEffect(() => {
    const handler = (workspace) => {
      handleNewPublicWorkspace(workspace);
    };

    socket.on("publicWorkspaceCreated", handler);

    return () => {
      socket.off("publicWorkspaceCreated", handler);
    };
  }, []);




  useEffect(() => {
    // maj liste des users connectés
    socket.on("connectedUsers", setConnectedUsers);
    return () => socket.off("connectedUsers");
  }, [socket]);



  useEffect(() => {
    const handleWorkspaceCreated = (newWorkspace) => {
      if (newWorkspace?.id) {
        socket.emit("joinWorkspace", { workspace_id: newWorkspace.id }); // auto join du nouveau workspace qu'on vient de creer
      }
    };
    socket.on("workspaceCreated", handleWorkspaceCreated);
    return () => socket.off("workspaceCreated", handleWorkspaceCreated);
  }, [socket]);

  useEffect(() => {
    socket.on("refreshWorkspaceMembers", ({ workspace_id }) => {
      if (workspace_id === selectedWorkspace?.id) {
        socket.emit("getWorkspaceMembers", { workspace_id });
      }
    });
    return () => socket.off("refreshWorkspaceMembers");
  }, [selectedWorkspace?.id]);

};

export default useSocketEvents;
