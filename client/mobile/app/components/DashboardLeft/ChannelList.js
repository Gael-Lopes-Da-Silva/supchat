import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

const ChannelList = ({
  channels = {},
  setSelectedChannel,
  selectedChannel,
  getBackground,
  getForeground,
  user,
  theme,
}) => {
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  const secondaryColor = theme === 'dark' ? '#cccccc' : '#666666';

  const sortedChannels = Object.values(channels)
    .filter(channel => channel && channel.id && channel.name)
    .sort((a, b) => {
      if (a.is_private === b.is_private) {
        return a.name.localeCompare(b.name);
      }
      return a.is_private ? 1 : -1;
    });

  if (sortedChannels.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: secondaryColor }]}>
            CANAUX
          </Text>
          <Text style={[styles.emptyText, { color: secondaryColor }]}>
            Aucun canal disponible
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: secondaryColor }]}>
          CANAUX
        </Text>

        {sortedChannels.map((channel) => (
          <TouchableOpacity
            key={channel.id}
            style={[
              styles.channelButton,
              selectedChannel?.id === channel.id && styles.selectedChannel,
            ]}
            onPress={() => setSelectedChannel(channel)}
          >
            <View style={styles.channelInfo}>
              <FontAwesome6
                name={channel.is_private ? 'lock' : 'hashtag'}
                size={14}
                color={textColor}
                style={styles.channelIcon}
              />
              <Text
                style={[
                  styles.channelName,
                  { color: textColor },
                  selectedChannel?.id === channel.id && styles.selectedChannelText,
                ]}
                numberOfLines={1}
              >
                {channel.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
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
});

export default ChannelList;