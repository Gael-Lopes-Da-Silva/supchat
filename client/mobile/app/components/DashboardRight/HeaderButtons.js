import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './DashboardRightStyle';

const HeaderButtons = ({
  selectedChannel,
  channelNotificationPrefs,
  toggleChannelNotifications,
}) => {
  const isMuted = channelNotificationPrefs[selectedChannel?.id] === false;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.channelInfo}>
        <FontAwesome6 name="hashtag" size={16} color="#666" style={styles.hashIcon} />
        <Text style={styles.channelName}>
          {selectedChannel?.name || "Aucun canal sélectionné"}
        </Text>
      </View>

      {selectedChannel?.id && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleChannelNotifications(selectedChannel.id)}
          >
            <FontAwesome6
              name={isMuted ? "bell-slash" : "bell"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome6 name="users" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome6 name="search" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default HeaderButtons;