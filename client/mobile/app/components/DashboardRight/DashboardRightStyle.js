import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default StyleSheet.create({
  // Styles from DashboardRight.js
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  // Container spécifique pour DiscoverWorkspaces
  discoverContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gestureContainer: {
    flex: 1,
    width: '100%',
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
  attachmentVideo: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  attachmentText: {
    color: '#007AFF',
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
    paddingHorizontal: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
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
    padding: 8,
    margin: 2,
    borderRadius: 4,
  },
  sendButton: {
    padding: 4,
  },
  emojiReactContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emojiPickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    zIndex: 1000,
  },
  emojiPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  emojiSelectorContainer: {
    height: 250,
    backgroundColor: '#fff',
  },

  // Styles from HeaderButtons.js
  headerContainer: {
    flexDirection: 'column',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    backgroundColor: '#fff',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  centerButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  leftButton: {
    position: 'absolute',
    left: 0,
  },
  actionButton: {
    padding: 8,
  },
  channelInfo: {
    alignItems: 'center',
  },
  channelName: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  myRoleLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  hashIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },

  // Styles from FooterButtons.js
  footerContainer: {
    flexDirection: 'row',
    gap: 10,
  },

  // Styles from DiscoverWorkspaces.js
  discoverheaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    backgroundColor: '#fff',
  },
  workspaceItem: {
    marginVertical: 10,
  },
  workspaceList: {
    flex: 1,
  },
  workspaceListContent: {
    padding: 16,
  },
  workspaceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  workspaceInfo: {
    marginBottom: 12,
  },
  workspaceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  workspaceDescription: {
    fontSize: 14,
    color: '#666',
  },
  joinButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  noChannelsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    width: '100%',
  },
  noChannelsText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.8,
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  messageSearchHint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  messageSearchInput: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  chatMessages: {
    flex: 1,
    marginTop: 8,
  },
  chatMessagesContent: {
    paddingBottom: 16,
    paddingTop: 8,
  },
  noMessagesText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
  },
  noChannelText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
    padding: 16,
  },
});