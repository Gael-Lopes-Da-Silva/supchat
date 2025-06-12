import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.7;
const WORKSPACE_SIDEBAR_WIDTH = 70;

export default StyleSheet.create({
  // DashboardLeft Styles
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    borderRightWidth: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    flexDirection: 'row',
  },
  workspacesSection: {
    width: WORKSPACE_SIDEBAR_WIDTH,
    height: '100%',
    borderRightWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
  },
  workspaceHeader: {
    padding: 16,
    borderBottomWidth: 1,
  },
  workspaceInfo: {
    marginBottom: 4,
  },
  workspaceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  channelName: {
    fontSize: 14,
    opacity: 0.7,
  },
  searchContainer: {
    padding: 12,
    borderBottomWidth: 1,
  },
  searchInput: {
    height: 36,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  channelsSection: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    paddingTop: 16,
    paddingBottom: 0,
    borderTopWidth: 1,
  },
  profileButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  username: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  settingsButton: {
    padding: 8,
  },

  // WorkspaceButtons Styles
  workspaceButtonsContainer: {
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  workspaceButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  helpButton: {
    backgroundColor: '#E0E0E0',
  },

  // WorkspaceList Styles
  workspaceListContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  workspaceListButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    marginVertical: 4,
    borderWidth: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workspaceText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  lockIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
  },
  workspaceIndicator: {
    position: 'absolute',
    left: 0,
    top: '20%',
    height: '60%',
    width: 4,
    backgroundColor: '#f77066',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  selectedWorkspace: {
    borderLeftWidth: 8,
    borderLeftColor: '#fffceb',
  },
  workspaceAvatar: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workspaceInitial: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  // ChannelList Styles
  channelListContainer: {
    flex: 1,
  },
  channelSection: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  channelSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  channelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  selectedChannel: {
    backgroundColor: '#007AFF22',
  },
  channelInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelIcon: {
    marginRight: 8,
    width: 16,
  },
  channelItemName: {
    fontSize: 15,
    flex: 1,
  },
  selectedChannelText: {
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: 16,
  },
  noChannelsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  noChannelsText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});