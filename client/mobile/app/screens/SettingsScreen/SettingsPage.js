import { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import socket from '../../socket';
import styles from './SettingsPageStyles';

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
        fetch(`https://api.example.com/users/${parsed.id}/providers`, {
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

  const handleLinkProvider = (provider) => {
    const token = user?.token;
    if (!token) return;
    Linking.openURL(`https://api.example.com/users/auth/${provider}/link?token=${token}`);
  };

  const handleUnlinkProvider = async (provider) => {
    if (!user?.id) return;
    try {
      const res = await fetch(`https://api.example.com/users/unlink-provider`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, provider }),
      });
      const data = await res.json();
      if (data.success) {
        provider === 'google' ? setIsGoogleLinked(false) : setIsFacebookLinked(false);
        setForceRender((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportData = () => {
    if (!user?.id) return;
    Linking.openURL(`https://api.example.com/users/${user.id}/export`);
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