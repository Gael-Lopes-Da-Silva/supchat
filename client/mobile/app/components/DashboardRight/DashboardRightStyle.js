import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default StyleSheet.create({
  // Styles from DashboardRight.js
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

  // Styles from HeaderButtons.js
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hashIcon: {
    marginRight: 8,
  },
  channelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },

  // Styles from FooterButtons.js
  footerContainer: {
    flexDirection: 'row',
    gap: 10,
  },

  // Styles from DiscoverWorkspaces.js
  workspaceItem: {
    marginVertical: 10,
  },
});