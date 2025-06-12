import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './DashboardRightStyle';

const HeaderButtons = ({
  selectedChannel,
  toggleChannelNotifications,
  channelNotificationPrefs,
  toggleLeftPanel,
  theme,
}) => {
  const textColor = theme === 'dark' ? '#fffceb' : '#333';

  return (
    <View style={styles.headerContainer}>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.leftButton]}
          onPress={toggleLeftPanel}
        >
          <FontAwesome6 name="bars" size={20} color={textColor} />
        </TouchableOpacity>

        <View style={styles.centerButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome6 name="thumbtack" size={20} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome6 name="bell" size={20} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome6 name="users" size={20} color={textColor} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.channelInfo}>
        <Text style={[styles.channelName, { color: textColor }]}>
          {selectedChannel?.id ? selectedChannel.name : "Aucun canal sélectionné"}
        </Text>
      </View>
    </View>
  );
};

export default HeaderButtons;