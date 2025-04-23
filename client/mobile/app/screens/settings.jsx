import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, Linking, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

const API_URL = 'http://localhost:3000';

export default function SettingsScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [isGoogleLinked, setIsGoogleLinked] = useState(false);
  const [isFacebookLinked, setIsFacebookLinked] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('user');
      const parsed = stored ? JSON.parse(stored) : null;
      setUser(parsed?.data || null);
      setTheme(parsed?.theme || 'light');

      if (parsed?.data?.id) {
        fetch(`${API_URL}/users/${parsed.data.id}/providers`, {
          headers: { Authorization: `Bearer ${parsed.token}` },
        })
          .then(res => res.json())
          .then(data => {
            setIsGoogleLinked(data.isGoogleLinked);
            setIsFacebookLinked(data.isFacebookLinked);
          })
          .catch(err => console.error('Erreur fetch providers :', err));
      }
    })();
  }, []);

  const handleLinkProvider = async (provider) => {
    const stored = await AsyncStorage.getItem('user');
    const token = stored ? JSON.parse(stored)?.token : null;
    if (!user?.id || !token) {
      Alert.alert("Erreur", "Vous devez être connecté.");
      return;
    }
    Linking.openURL(`${API_URL}/users/auth/${provider}/link?token=${token}`);
  };

  const handleUnlinkProvider = async (provider) => {
    const confirm = await new Promise(resolve => {
      Alert.alert(
        "Confirmation",
        `Voulez-vous vraiment délier votre compte ${provider} ?`,
        [
          { text: "Annuler", onPress: () => resolve(false) },
          { text: "Confirmer", onPress: () => resolve(true) },
        ]
      );
    });
    if (!confirm) return;

    const res = await fetch(`${API_URL}/users/unlink-provider`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, provider })
    });

    const data = await res.json();
    if (data.success) {
      if (provider === 'google') setIsGoogleLinked(false);
      if (provider === 'facebook') setIsFacebookLinked(false);
    } else {
      Alert.alert("Erreur", "Échec de la déliaison.");
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, theme === 'dark' && styles.dark]}>
      <Text style={styles.title}>Paramètres de mon compte</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.replace('/screens/dashboard')}>
        <Text style={styles.buttonText}>Retour au dashboard</Text>
      </TouchableOpacity>

      {user && (
        <View style={styles.providersBox}>
          {user.provider === null && (
            <>
              {isGoogleLinked ? (
                <View style={styles.linkedRow}>
                  <FontAwesome name="google" size={24} color="#fff" />
                  <Text style={styles.linkedText}>Google lié ✅</Text>
                  <TouchableOpacity onPress={() => handleUnlinkProvider("google")}>
                    <Text style={styles.unlink}>❌</Text>
                  </TouchableOpacity>
                </View>
              ) : !isFacebookLinked && (
                <TouchableOpacity style={styles.linkButton} onPress={() => handleLinkProvider("google")}>
                  <FontAwesome name="google" size={20} color="#fff" />
                  <Text style={styles.linkButtonText}>Lier Google</Text>
                </TouchableOpacity>
              )}

              {isFacebookLinked ? (
                <View style={styles.linkedRow}>
                  <FontAwesome5 name="facebook" size={24} color="#fff" />
                  <Text style={styles.linkedText}>Facebook lié ✅</Text>
                  <TouchableOpacity onPress={() => handleUnlinkProvider("facebook")}>
                    <Text style={styles.unlink}>❌</Text>
                  </TouchableOpacity>
                </View>
              ) : !isGoogleLinked && (
                <TouchableOpacity style={styles.linkButton} onPress={() => handleLinkProvider("facebook")}>
                  <FontAwesome5 name="facebook" size={20} color="#fff" />
                  <Text style={styles.linkButtonText}>Lier Facebook</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fffceb',
    padding: 20,
    alignItems: 'center',
    flexGrow: 1,
  },
  dark: {
    backgroundColor: '#4d4d4d',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fffceb',
    fontWeight: 'bold',
  },
  providersBox: {
    width: '100%',
    padding: 15,
    backgroundColor: '#3d3d3d',
    borderRadius: 10,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  linkButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  linkedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  linkedText: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 10,
  },
  unlink: {
    fontSize: 18,
    color: '#ff4444',
  },
});