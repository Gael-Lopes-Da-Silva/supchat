import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './DashboardLeftStyle';

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
      <View style={styles.channelListContainer}>
        <View style={styles.channelSection}>
          <Text style={[styles.channelSectionTitle, { color: secondaryColor }]}>
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
    <ScrollView style={styles.channelListContainer}>
      <View style={styles.channelSection}>
        <Text style={[styles.channelSectionTitle, { color: secondaryColor }]}>
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

export default ChannelList;