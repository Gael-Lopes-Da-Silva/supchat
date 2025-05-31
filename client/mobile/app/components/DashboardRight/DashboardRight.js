import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import EmojiSelector from 'react-native-emoji-selector';
import socket from '../../socket';
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
}) => {
    const [input, setInput] = useState('');
    const [channelMembers, setChannelMembers] = useState([]);
    const [messageSearchTerm, setMessageSearchTerm] = useState('');
    const [mentionSuggestions, setMentionSuggestions] = useState([]);
    const [showMentions, setShowMentions] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [userSearchTerm, setUserSearchTerm] = useState('');
  const [activeEmojiPickerMessageId, setActiveEmojiPickerMessageId] = useState(null);

    const isAdmin = currentUserRoleId === 1;
  const flatListRef = useRef(null);
  const insets = useSafeAreaInsets();

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

  const handleEmojiSelect = (emoji) => {
    if (activeEmojiPickerMessageId) {
      toggleReaction(activeEmojiPickerMessageId, emoji);
      setActiveEmojiPickerMessageId(null);
    } else {
      setInput((prev) => prev + emoji);
    }
    setShowEmojiPicker(false);
  };

  const toggleReaction = (message_id, emoji) => {
    const message = messages.find(msg => msg.id === message_id);
    const userReacted = message.reactions?.some(
      (r) => r.emoji === emoji && r.user_ids?.includes(user.id)
    );

    if (userReacted) {
      socket.emit("removeReaction", { message_id, user_id: user.id, emoji });
    } else {
      socket.emit("addReaction", { message_id, user_id: user.id, emoji });
    }
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder à vos photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.image],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
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
    }
  };

    const sendMessage = () => {
    if (!input.trim() && !selectedChannel?.id) return;

    socket.emit("message", {
                user_id: user.id,
      username: user.username,
      content: input.trim(),
      channel_id: selectedChannel.id,
      channel_name: selectedChannel.name,
      workspace_id: selectedWorkspace.id,
    });

            setInput('');
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

  const renderMessage = ({ item: message }) => {
    const isCurrentUser = message.user_id === user.id;

        return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
      ]}>
        <View style={styles.messageHeader}>
          <Text style={styles.username}>{message.username}</Text>
          <Text style={styles.timestamp}>
            {new Date(message.created_at).toLocaleTimeString()}
          </Text>
        </View>
        
        <View style={styles.messageContent}>
          {message.content && (
            <Text style={styles.messageText}>{message.content}</Text>
          )}
          {message.attachment && (
            <Image
              source={{ uri: message.attachment }}
              style={styles.attachmentImage}
              resizeMode="contain"
            />
          )}
        </View>

        <View style={styles.reactionsContainer}>
          {message.reactions?.map((reaction, index) => (
            <TouchableOpacity
              key={`${reaction.emoji}-${index}`}
              style={styles.reactionButton}
              onPress={() => toggleReaction(message.id, reaction.emoji)}
            >
              <Text>{reaction.emoji}</Text>
              <Text style={styles.reactionCount}>
                {reaction.user_ids?.length || 0}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.addReactionButton}
            onPress={() => {
              setActiveEmojiPickerMessageId(message.id);
              setShowEmojiPicker(true);
            }}
          >
            <FontAwesome6 name="face-smile" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    );
    };

  // Gestionnaire pour l'ouverture du drawer depuis le bord gauche
  const edgeGestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.startX = event.absoluteX;
    },
    onActive: (event, ctx) => {
      if (ctx.startX <= EDGE_WIDTH && event.translationX > 0) {
        runOnJS(updateGuiState)('leftPanel', true);
      }
    },
    onEnd: (event) => {
      if (event.velocityX > 200 || event.translationX > SWIPE_THRESHOLD) {
        runOnJS(updateGuiState)('leftPanel', true);
      }
    },
  });

  return (
    <KeyboardAvoidingView
      style={[styles.container]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
    >
      <PanGestureHandler 
        onGestureEvent={edgeGestureHandler}
        activeOffsetX={[-5, 5]}
        failOffsetY={[-20, 20]}
      >
        <Reanimated.View style={styles.gestureContainer}>
          <HeaderButtons
            selectedChannel={selectedChannel}
            channelNotificationPrefs={channelNotificationPrefs}
            toggleChannelNotifications={toggleChannelNotifications}
          />

          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messagesList}
            contentContainerStyle={[
              styles.messagesContent,
              { paddingBottom: 12 }
            ]}
            inverted
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
        </Reanimated.View>
      </PanGestureHandler>

      <View style={[
        styles.inputContainer,
        { 
          paddingBottom: Platform.OS === 'ios' 
            ? insets.bottom + 8
            : Math.max(insets.bottom + 12, 20)
        }
      ]}>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={handleImagePick}
        >
          <FontAwesome6 name="paperclip" size={18} color="#666" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
                                value={input}
          onChangeText={setInput}
          placeholder="Écrivez votre message..."
          multiline
          maxHeight={80}
          returnKeyType="send"
          onSubmitEditing={sendMessage}
          blurOnSubmit={false}
        />

        <TouchableOpacity
          style={styles.emojiButton}
          onPress={() => setShowEmojiPicker(true)}
        >
          <FontAwesome6 name="face-smile" size={18} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={!input.trim()}
        >
          <FontAwesome6
            name="paper-plane"
            size={18}
            color={input.trim() ? '#007AFF' : '#666'}
          />
        </TouchableOpacity>
      </View>

      {showEmojiPicker && (
        <View style={[
          styles.emojiPickerContainer,
          { 
            paddingBottom: Platform.OS === 'ios'
              ? insets.bottom + 8
              : Math.max(insets.bottom + 12, 20)
          }
        ]}>
          <TouchableOpacity
            style={styles.emojiPickerHeader}
            onPress={() => setShowEmojiPicker(false)}
          >
            <FontAwesome6 name="chevron-down" size={18} color="#666" />
          </TouchableOpacity>
          <EmojiSelector
            onEmojiSelected={handleEmojiSelect}
            columns={8}
            showSearchBar={false}
            showHistory={false}
            showSectionTitles={false}
            category={['smileys_emotion', 'people_body', 'animals_nature', 'food_drink', 'travel_places', 'activities', 'objects', 'symbols', 'flags']}
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gestureContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingBottom: 12,
  },
  messageContainer: {
    padding: 4,
    marginHorizontal: 6,
    marginVertical: 2,
    borderRadius: 10,
    maxWidth: '80%',
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF22',
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    color: '#666',
  },
  messageContent: {
    marginBottom: 2,
  },
  messageText: {
    fontSize: 15,
    color: '#333',
  },
  attachmentImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginTop: 4,
  },
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  reactionCount: {
    marginLeft: 2,
    fontSize: 11,
    color: '#666',
  },
  addReactionButton: {
    padding: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  attachButton: {
    padding: 4,
  },
  input: {
    flex: 1,
    marginHorizontal: 4,
    padding: 4,
    maxHeight: 80,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  emojiButton: {
    padding: 4,
  },
  sendButton: {
    padding: 4,
  },
  emojiPickerContainer: {
    height: 250,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  emojiPickerHeader: {
    alignItems: 'center',
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default DashboardRight;
