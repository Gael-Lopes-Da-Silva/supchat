import { View, Text, Button } from "react-native";

const DashboardPopups = ({
  visibility,
  theme,
  mousePosition,
  joinedUsername,
  onLogout,
  notifications,
  handleClickNotification,
  handleRemoveNotification,
}) => {
  return (
    <View>
      {visibility.profile && (
        <View
          style={{
            position: "absolute",
            top: mousePosition.y,
            left: mousePosition.x,
            backgroundColor: theme === "dark" ? "#333" : "#fff",
            padding: 10,
            borderRadius: 8,
            zIndex: 1000,
          }}
          ref={refs.profile}
        >
          <Button title="Déconnexion" onPress={onLogout} />
        </View>
      )}

      {visibility.pinned && (
        <View>
          <Text>Messages épinglés</Text>
        </View>
      )}

      {visibility.notifications && (
        <View>
          <Text>Notifications</Text>
          {notifications.length === 0 ? (
            <Text>Aucune notification.</Text>
          ) : (
            notifications.map((notif, index) => (
              <View key={index}>
                <Text onPress={() => handleClickNotification(index, notif)}>
                  {notif.message}
                </Text>
                <Button
                  title="✖"
                  onPress={() => handleRemoveNotification(index)}
                />
              </View>
            ))
          )}
        </View>
      )}

      {visibility.joinedNotification && (
        <Text>{joinedUsername} a rejoint ce workspace ! 🎉</Text>
      )}

      {visibility.emojis && <Text>Emojis</Text>}
    </View>
  );
};

export default DashboardPopups;
