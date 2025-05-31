import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

const HeaderButtons = ({
  selectedChannel,
  channelNotificationPrefs,
  toggleChannelNotifications,
}) => {
  const isMuted = channelNotificationPrefs[selectedChannel?.id] === false;

  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
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
});

export default HeaderButtons;