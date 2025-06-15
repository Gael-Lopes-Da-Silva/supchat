import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import EmojiSelector from 'react-native-emoji-selector';
import socket from '../../socket';
import Constants from 'expo-constants';
import {
  getUserChannelIds,
  getUsersReactions,
  getChannelMembers,
  uploadFile,
} from '../../../services/Channels';
import { deleteWorkspaceMember } from '../../../services/WorkspaceMembers';
import HeaderButtons from './HeaderButtons';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Reanimated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { isSafeUrl } from '../../../utils/securityUtils';
import styles from './DashboardRightStyle';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const EDGE_WIDTH = 20; // Zone de détection sur le bord gauche
const SWIPE_THRESHOLD = 50; // Seuil pour l'ouverture

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
  theme,
}) => {
  const [input, setInput] = useState('');
  const [channelMembers, setChannelMembers] = useState([]);
  const [messageSearchTerm, setMessageSearchTerm] = useState('');
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [showMentions, setShowMentions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [activeEmojiPickerMessageId, setActiveEmojiPickerMessageId] = useState(null);

  // Émojis prédéfinis uniquement pour les réactions
  const predefinedEmojis = React.useMemo(() => ["❤️", "😂", "👍", "👎", "🔥", "😢", "😡"], []);

  const isAdmin = currentUserRoleId === 1;
  const myRoleLabel =
    currentUserRoleId === 1
      ? "Admin"
      : currentUserRoleId === 2
        ? "Membre"
        : currentUserRoleId === 3
          ? "Invité"
          : "";

  const flatListRef = useRef(null);
  const insets = useSafeAreaInsets();
  const textColor = theme === 'dark' ? '#fffceb' : '#333';

  const scrollViewRef = useRef(null);

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

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [messages]);

  const handleEmojiSelect = (emoji) => {
    try {
      setInput((prev) => prev + emoji);
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Erreur lors de la sélection d\'émoji:', error);
    }
  };

  const toggleReaction = (message_id, emoji) => {
    try {
      const message = messages.find(msg => msg.id === message_id);
      if (!message) return;

      const userReacted = message.reactions?.some(
        (r) => r.emoji === emoji && r.user_ids?.includes(user.id)
      );

      if (userReacted) {
        socket.emit("removeReaction", { message_id, user_id: user.id, emoji });
      } else {
        socket.emit("addReaction", { message_id, user_id: user.id, emoji });
      }
    } catch (error) {
      console.error('Erreur lors de la réaction:', error);
    }
  };

  const showEmojiPickerFor = (message_id) => {
    try {
      setActiveEmojiPickerMessageId(message_id);
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du sélecteur d\'émojis:', error);
    }
  };

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder à vos photos.');
        return;
      }

      console.log('Lancement du sélecteur d\'images');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: [ImagePicker.MediaType.IMAGE],
        allowsEditing: true,
        quality: 1,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const formData = new FormData();
        formData.append('file', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        });
        formData.append('channel_id', selectedChannel.id);
        formData.append('user_id', user.id);

        try {
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
            });
          }
        } catch (error) {
          Alert.alert('Erreur', 'Impossible d\'envoyer l\'image.');
        }
      } else {
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection de l\'image.');
    }
  };

  const sendMessage = () => {
    if (input.trim() && selectedChannel?.id && user?.id){
      socket.emit("sendMessage", {
        user_id: user.id,
        content: input.trim(),
        channel_id: selectedChannel.id,
      });
  
      setInput('');
    }
  };

  const toggleChannelNotifications = (channelId) => {
    setChannelNotificationPrefs((prev) => {
      const updated = { ...prev };
      if (updated[channelId] === undefined) {
        updated[channelId] = true;
      } else {
        updated[channelId] = !updated[channelId];
      }
      return updated;
    });
  };

  const getAttachmentUrl = (path) => {
    if (!path) return null;
    const API_URL = Constants.expoConfig.extra.apiUrl?.replace(/\/$/, "");
    const url = path.startsWith("http") ? path : `${API_URL}${path}`;
    return isSafeUrl(url) ? url : null;
  };

  const getFileName = (path) => {
    return path.split('/').pop();
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

  const renderAttachment = (attachment) => {
    const url = getAttachmentUrl(attachment);
    const isSafe = isSafeUrl(url);

    if (!isSafe) return null;

    if (attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return (
        <Image
          source={{ uri: url }}
          style={styles.attachmentImage}
          resizeMode="contain"
        />
      );
    } else if (attachment.match(/\.(mp4|webm)$/i)) {
      return (
        <View style={styles.attachmentVideo}>
          <Text style={styles.attachmentText}>Vidéo disponible</Text>
        </View>
      );
    } else {
      return (
        <Text style={styles.attachmentText}>{getFileName(attachment)}</Text>
      );
    }
  };

  const handleMessagePress = (e) => {
    e.stopPropagation();
  };

  const renderMessage = ({ item: message }) => {
    if (!message) {
      return null;
    }
    
    const isCurrentUser = message.user_id === user.id;

    // Vérification de la structure des réactions
    const reactions = Array.isArray(message.reactions) ? message.reactions : [];

    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
      ]}>
        <View style={styles.messageHeader}>
          <Text style={styles.username}>{message.username}</Text>
          <Text style={styles.timestamp}>
          {" "}
          · {formatTimestamp(message.created_at)}
          </Text>
        </View>
        <View style={styles.messageContent}>
          {message.content && (
            <Text style={styles.messageText}>{message.content}</Text>
          )}
          {message.attachment && renderAttachment(message.attachment)}
        </View>
        <View style={styles.reactionsContainer}>
          {reactions && reactions.length > 0 && reactions.map((reaction, index) => {
            return (
              <TouchableOpacity
                key={`${reaction.emoji}-${index}`}
                style={styles.reactionButton}
                onPress={() => toggleReaction(message.id, reaction.emoji)}
              >
                <Text style={{ fontSize: 16, includeFontPadding: false, letterSpacing: 0 }}>{reaction.emoji}</Text>
                <Text style={styles.reactionCount}>
                  {reaction.user_ids?.length || 0}
                </Text>
              </TouchableOpacity>
            );
          })}
          {(!reactions || !reactions.some(r => r.user_ids?.includes(user.id))) && (
            <TouchableOpacity
              style={styles.addReactionButton}
              onPress={() => showEmojiPickerFor(message.id)}
            >
              <FontAwesome6 name="face-smile" size={16} color="#666" />
            </TouchableOpacity>
          )}
          {activeEmojiPickerMessageId === message.id && predefinedEmojis && (
            <View style={styles.emojiReactContainer}>
              <TouchableOpacity
                style={styles.emojiPickerHeader}
                onPress={() => setActiveEmojiPickerMessageId(null)}
              >
                <FontAwesome6 name="chevron-down" size={18} color="#666" />
              </TouchableOpacity>
              {predefinedEmojis.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={styles.emojiButton}
                  onPress={() => {
                    toggleReaction(message.id, emoji);
                    setActiveEmojiPickerMessageId(null);
                  }}
                >
                  <Text style={{ fontSize: 20, includeFontPadding: false, letterSpacing: 0 }}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff' }]}>
      <HeaderButtons
        selectedWorkspace={selectedWorkspace}
        selectedChannel={selectedChannel}
        user={user}
        guiVisibility={guiVisibility}
        updateGuiState={updateGuiState}
        hideAllPopup={hideAllPopup}
        updatePopupState={updatePopupState}
        setMousePosition={setMousePosition}
        notifications={notifications}
        channelNotificationPrefs={channelNotificationPrefs}
        toggleChannelNotifications={toggleChannelNotifications}
        toggleLeftPanel={() => updateGuiState("leftPanel", !guiVisibility.leftPanel)}
        myRoleLabel={myRoleLabel}
      />

      {selectedWorkspace.id && selectedChannel?.id ? (
        <View style={styles.chatContainer}>
          <Text style={styles.messageSearchHint}>
            Astuce : tapez <Text style={styles.bold}>photos</Text>, <Text style={styles.bold}>videos</Text> ou <Text style={styles.bold}>.pdf (par exemple)</Text> pour filtrer par type de fichier.
          </Text>

          <TextInput
            style={styles.messageSearchInput}
            placeholder="Rechercher un message..."
            value={messageSearchTerm}
            onChangeText={setMessageSearchTerm}
            placeholderTextColor="#666"
          />

          <View style={styles.chatMessages}>
            <ScrollView
              contentContainerStyle={styles.chatMessagesContent}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
            >
              {filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                  <TouchableOpacity 
                    key={message.id}
                    onPress={handleMessagePress}
                    activeOpacity={1}
                  >
                    {renderMessage({ item: message })}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noMessagesContainer}>
                  <Text style={styles.noMessagesText}>Aucun message</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      ) : hasNoChannels ? (
        <Text style={styles.noChannelText}>
          Ce workspace n'a pas encore de canaux. Créez-en un pour démarrer la discussion !
        </Text>
      ) : (
        <Text style={styles.noChannelText}>
          Sélectionnez un canal ou créez en un pour voir les messages.
        </Text>
      )}

      {selectedChannel?.id && (
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.attachButton}
            onPress={handleImagePick}
          >
            <FontAwesome6 name="paperclip" size={18} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.emojiButton}
            onPress={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <FontAwesome6 name="face-smile" size={24} color="#666" />
          </TouchableOpacity>
          
          <TextInput
            style={[styles.input, { color: textColor }]}
            value={input}
            onChangeText={setInput}
            placeholder="Écrire un message..."
            placeholderTextColor="#666"
            multiline
          />
          
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
          >
            <FontAwesome6 name="paper-plane" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      )}

      {showEmojiPicker && (
        <View style={styles.emojiPickerContainer}>
          <TouchableOpacity
            style={styles.emojiPickerHeader}
            onPress={() => setShowEmojiPicker(false)}
          >
            <FontAwesome6 name="chevron-down" size={18} color="#666" />
          </TouchableOpacity>
          <View style={styles.emojiSelectorContainer}>
            <EmojiSelector
              onEmojiSelected={handleEmojiSelect}
              showSearchBar={false}
              showHistory={false}
              showSectionTitles={false}
              columns={8}
              theme="light"
              style={{ height: 250 }}
              emojiSize={24}
              showTabs={false}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default DashboardRight;
