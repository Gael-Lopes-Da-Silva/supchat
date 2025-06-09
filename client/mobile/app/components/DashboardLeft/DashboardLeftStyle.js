import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.7;

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
    zIndex: 1000,
  },
  workspacesSection: {
    flexDirection: 'row',
    height: 70,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  workspaceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  workspaceInfo: {
    flex: 1,
    marginRight: 8,
  },
  workspaceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  workspaceDescription: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
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
    backgroundColor: '#fff',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  workspaceButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
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
  channelName: {
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

  // WorkspaceList Styles
  workspaceListContainer: {
    flexGrow: 0,
  },
  workspaceListButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    marginHorizontal: 4,
    borderWidth: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedWorkspace: {
    borderColor: '#007AFF',
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
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    marginHorizontal: 4,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
});