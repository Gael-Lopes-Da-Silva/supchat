import { View, Text, Button } from 'react-native';

const HeaderButtons = ({
  guiVisibility,
  updateGuiState,
  hideAllPopup,
  updatePopupState,
  setMousePosition,
  notifications,
  selectedChannel,
  channelNotificationPrefs,
  toggleChannelNotifications,
}) => {
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <Button title="Panneau gauche" onPress={() => updateGuiState("leftPanel", !guiVisibility.leftPanel)} />
      <Button title="Messages épinglés" onPress={() => updatePopupState("pinned", true)} />
      <Button title="Notifications" onPress={() => updatePopupState("notifications", true)} />
      <Button title="Utilisateurs" onPress={() => updateGuiState("userList", !guiVisibility.userList)} />
      {selectedChannel?.id && (
        <Button
          title={channelNotificationPrefs[selectedChannel.id] === false ? "Activer le son" : "Couper le son"}
          onPress={() => toggleChannelNotifications(selectedChannel.id)}
        />
      )}
    </View>
  );
};

export default HeaderButtons;