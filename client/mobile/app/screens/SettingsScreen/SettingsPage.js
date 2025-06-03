import { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';

import socket from '../../socket';
import styles from './SettingsPageStyles';

const API_URL = Constants.expoConfig.extra.apiUrl;

// Configuration de Google Sign-In
// GoogleSignin.configure({
//   webClientId: process.env.GOOGLE_MOBILE_CLIENT_ID,
//   iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
// });

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [status, setStatus] = useState('online');
  const [isGoogleLinked, setIsGoogleLinked] = useState(false);
  const [isFacebookLinked, setIsFacebookLinked] = useState(false);
  const [forceRender, setForceRender] = useState(0);

  const navigation = useNavigation();

  useEffect(() => {
    AsyncStorage.getItem('user').then((u) => {
      const parsed = JSON.parse(u)?.data;
      setUser(parsed);
      if (parsed?.id) {
        fetch(`${API_URL}/users/${parsed.id}/providers`, {
          headers: { Authorization: `Bearer ${parsed.token}` },
        })
          .then(res => res.json())
          .then(data => {
            setIsGoogleLinked(data.isGoogleLinked);
            setIsFacebookLinked(data.isFacebookLinked);
          })
          .catch(err => console.error("Erreur:", err));
      }
    });
    AsyncStorage.getItem('gui.theme').then(setTheme);
    AsyncStorage.getItem('user.status').then(setStatus);
  }, []);

  const handleLinkProvider = async (provider) => {
    // Version temporaire pour le développement
    Toast.show({
      type: 'info',
      text1: `Liaison ${provider} désactivée en développement`,
      text2: 'Cette fonctionnalité nécessite un development build'
    });
  };

  const handleUnlinkProvider = async (provider) => {
    // Version temporaire pour le développement
    Toast.show({
      type: 'info',
      text1: `Déliaison ${provider} désactivée en développement`,
      text2: 'Cette fonctionnalité nécessite un development build'
    });
  };

  const handleExportData = () => {
    if (!user?.id) return;
    Linking.openURL(`${API_URL}/users/${user.id}/export`);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    AsyncStorage.setItem("user.status", newStatus);
    socket.emit("updateStatus", { user_id: user.id, status: newStatus });
  };

  return (
    <View style={[styles.container, styles[theme]]} key={forceRender}>
      <View style={styles.leftPanel}>
        <View style={styles.categoryBox}>
          <Text style={styles.categoryTitle}>Paramètre utilisateur</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
            <Text style={styles.link}>Mon compte</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.rightPanel}>
        <Text style={styles.panelTitle}>Mon compte</Text>
        {user && (
          <>
            <Text>Nom d'utilisateur : {user.username}</Text>
            <Text>Email : {user.email}</Text>

            <Text>Thème :</Text>
            <Button title="Clair" onPress={() => { setTheme("light"); AsyncStorage.setItem("gui.theme", "light"); }} />
            <Button title="Sombre" onPress={() => { setTheme("dark"); AsyncStorage.setItem("gui.theme", "dark"); }} />

            <Text>Statut :</Text>
            {["online", "busy", "away", "offline"].map((s) => (
              <Button key={s} title={s} onPress={() => handleStatusChange(s)} />
            ))}

            <Button title="Exporter mes données" onPress={handleExportData} />

            {user.provider === null && (
              <>
                {isGoogleLinked ? (
                  <View>
                    <Text>✅ Google lié</Text>
                    <Button title="❌ Délier Google" onPress={() => handleUnlinkProvider("google")} />
                  </View>
                ) : !isFacebookLinked && (
                  <Button title="Lier Google" onPress={() => handleLinkProvider("google")} />
                )}

                {isFacebookLinked ? (
                  <View>
                    <Text>✅ Facebook lié</Text>
                    <Button title="❌ Délier Facebook" onPress={() => handleUnlinkProvider("facebook")} />
                  </View>
                ) : !isGoogleLinked && (
                  <Button title="Lier Facebook" onPress={() => handleLinkProvider("facebook")} />
                )}
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default SettingsPage;