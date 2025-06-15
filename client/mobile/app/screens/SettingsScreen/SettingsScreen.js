import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';
import { FontAwesome6 } from '@expo/vector-icons';

import socket from '../../socket';
import styles from './SettingsScreenStyles';
import { updateUser, getUserProviders, unlinkProvider } from '../../../services/Users';
import Modal from '../../components/Modal/Modal';

const API_URL = Constants.expoConfig.extra.apiUrl;

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [status, setStatus] = useState('online');
  const [isGoogleLinked, setIsGoogleLinked] = useState(false);
  const [isFacebookLinked, setIsFacebookLinked] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem('user').then((u) => {
      const parsed = JSON.parse(u)?.data;
      setUser(parsed);
      if (parsed?.id) {
        getUserProviders(parsed.id).then(data => {
          if (!data.error) {
            setIsGoogleLinked(data.isGoogleLinked);
            setIsFacebookLinked(data.isFacebookLinked);
          } else {
            console.error("Erreur de récupération des providers:", data.message);
          }
        });
      }
    });

    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('gui.theme');
      setTheme(savedTheme || 'light');
    };
    loadTheme(); AsyncStorage.getItem('user.status').then(setStatus);
  }, []);

  const handleLinkProvider = async (provider) => {
    const user = await AsyncStorage.getItem('user');
    const token = JSON.parse(user)?.token;

    if (!token) {
      Toast.show({
        type: 'error',
        text1: 'Vous devez être connecté pour lier un compte.',
      });
      return;
    }
    Linking.openURL(`${API_URL}/users/auth/${provider}/link?token=${token}`);
  };

  const handleUnlinkProvider = async (provider) => {
    if (!user?.id) return;

    Alert.alert(
      "Confirmation",
      `Voulez-vous vraiment délier votre compte ${provider} ?`,
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Confirmer",
          onPress: async () => {
            const data = await unlinkProvider(user.id, provider);
            if (!data.error && data.success) {
              if (provider === "google") setIsGoogleLinked(false);
              if (provider === "facebook") setIsFacebookLinked(false);
              Toast.show({
                type: 'success',
                text1: 'Compte délié avec succès',
              });
            } else {
              Toast.show({
                type: 'error',
                text1: `Erreur de déliaison : ${data.message}`,
              });
            }
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    if (!user?.id) return;
    Linking.openURL(`${API_URL}users/${user.id}/export`);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    AsyncStorage.setItem("user.status", newStatus);
    socket.emit("updateStatus", { user_id: user.id, status: newStatus });

    socket.once("userStatusBroadcast", ({ user_id, status }) => {
      if (user_id === user.id) {
        setStatus(status);
      }
    });
  };

  const handleSaveChanges = async () => {
    const payload = {};
    if (newUsername) payload.username = newUsername;
    if (newPassword) payload.password = newPassword;

    if (Object.keys(payload).length === 0) {
      Toast.show({
        type: 'warning',
        text1: 'Aucune modification à envoyer',
      });
      return;
    }

    const data = await updateUser(user.id, payload);
    if (!data.error && data?.result?.success) {
      Toast.show({
        type: 'success',
        text1: data.result.message || 'Informations mises à jour',
      });

      if (newUsername) {
        const updatedUser = { ...user, username: newUsername };
        await AsyncStorage.setItem('user', JSON.stringify({ data: updatedUser }));
        setUser(updatedUser);
      }

      setNewUsername('');
      setNewPassword('');
      return true;
    } else {
      Toast.show({
        type: 'error',
        text1: data?.result?.message || data.message,
      });
      return false;
    }
  };

  const getStatusEmoji = (statusType) => {
    switch (statusType) {
      case 'online': return '🟢';
      case 'busy': return '🔴';
      case 'away': return '🟡';
      case 'offline': return '⚫';
      default: return '🟢';
    }
  };

  const handleLogout = async () => {
    socket.disconnect();
    socket.connect();
    await AsyncStorage.removeItem('user');
    router.push('/screens/LoginScreen/LoginScreen');
  };

  const handleLinkGoogle = async () => {
  };

  const handlLinkeFacebook = async () => {
  };

  return (
    <ScrollView style={[styles.container, styles[theme]]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, styles[`${theme}Text`]]}>Paramètres</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push("/screens/DashboardScreen/DashboardScreen")}
        >
          <FontAwesome6 name="xmark" size={20} color={theme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>

      {user && (
        <View style={styles.content}>
          <View style={[styles.section, styles[`${theme}Section`]]}>
            <Text style={[styles.sectionTitle, styles[`${theme}Text`]]}>Informations du compte</Text>
            <View style={styles.infoRow}>
              <Text style={[styles.label, styles[`${theme}Text`]]}>Nom d'utilisateur :</Text>
              <Text style={[styles.value, styles[`${theme}Text`]]}>{user.username}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.label, styles[`${theme}Text`]]}>Email :</Text>
              <Text style={[styles.value, styles[`${theme}Text`]]}>{user.email}</Text>
            </View>
          </View>

          <View style={[styles.section, styles[`${theme}Section`]]}>
            <Text style={[styles.sectionTitle, styles[`${theme}Text`]]}>Apparence</Text>
            <View style={styles.themeButtons}>
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  theme === 'light' && styles.themeButtonActive,
                  styles[`${theme}Button`]
                ]}
                onPress={() => {
                  setTheme('light');
                  AsyncStorage.setItem('gui.theme', 'light');
                }}
              >
                <Text style={[styles.buttonText, styles[`${theme}Text`]]}>Thème clair</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  theme === 'dark' && styles.themeButtonActive,
                  styles[`${theme}Button`]
                ]}
                onPress={() => {
                  setTheme('dark');
                  AsyncStorage.setItem('gui.theme', 'dark');
                }}
              >
                <Text style={[styles.buttonText, styles[`${theme}Text`]]}>Thème sombre</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.section, styles[`${theme}Section`]]}>
            <Text style={[styles.sectionTitle, styles[`${theme}Text`]]}>Statut</Text>
            <View style={styles.statusButtons}>
              {[
                { value: 'online', label: 'En ligne' },
                { value: 'busy', label: 'Occupé' },
                { value: 'away', label: 'Absent' },
                { value: 'offline', label: 'Hors ligne' }
              ].map((s) => (
                <TouchableOpacity
                  key={s.value}
                  style={[
                    styles.statusButton,
                    status === s.value && styles.statusButtonActive,
                    styles[`${theme}Button`]
                  ]}
                  onPress={() => handleStatusChange(s.value)}
                >
                  <Text style={[styles.buttonText, styles[`${theme}Text`]]}>
                    {getStatusEmoji(s.value)} {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.section, styles[`${theme}Section`]]}>
            <Text style={[styles.sectionTitle, styles[`${theme}Text`]]}>Actions du compte</Text>
            <TouchableOpacity
              style={[styles.actionButton, styles[`${theme}Button`]]}
              onPress={() => setShowUsernameModal(true)}
            >
              <Text style={[styles.buttonText, styles[`${theme}Text`]]}>
                Modifier le nom d'utilisateur
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles[`${theme}Button`]]}
              onPress={() => setShowPasswordModal(true)}
            >
              <Text style={[styles.buttonText, styles[`${theme}Text`]]}>
                Modifier le mot de passe
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles[`${theme}Button`]]}
              onPress={handleExportData}
            >
              <Text style={[styles.buttonText, styles[`${theme}Text`]]}>
                Exporter mes données
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles[`${theme}Button`]]}
              onPress={handleLogout}
            >
              <Text style={[styles.buttonText, styles[`${theme}Text`]]}>
                Se déconnecter
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles[`${theme}Button`]]}
              onPress={handleLinkGoogle}
            >
              <FontAwesome6 name="google" size={20} />
              <Text style={[styles.buttonText, styles[`${theme}Text`]]}>
                Lier mon compte Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles[`${theme}Button`]]}
              onPress={handlLinkeFacebook}
            >
              <FontAwesome6 name="facebook-f" size={20} color="#4267B2" />
              <Text style={[styles.buttonText, styles[`${theme}Text`]]}>
                Lier mon compte Facebook
              </Text>
            </TouchableOpacity>
          </View>

          {user.provider === null && (
            <View style={[styles.section, styles[`${theme}Section`]]}>
              <Text style={[styles.sectionTitle, styles[`${theme}Text`]]}>Comptes liés</Text>
              {isGoogleLinked ? (
                <View style={styles.linkedAccount}>
                  <Text style={[styles.linkedText, styles[`${theme}Text`]]}>
                    ✅ Compte Google lié
                  </Text>
                  <TouchableOpacity
                    style={[styles.unlinkButton, styles[`${theme}Button`]]}
                    onPress={() => handleUnlinkProvider("google")}
                  >
                    <Text style={[styles.buttonText, styles[`${theme}Text`]]}>
                      Délier
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : !isFacebookLinked && (
                <TouchableOpacity
                  style={[styles.actionButton, styles[`${theme}Button`]]}
                  onPress={() => handleLinkProvider("google")}
                >
                  <Text style={[styles.buttonText, styles[`${theme}Text`]]}>
                    Lier avec Google
                  </Text>
                </TouchableOpacity>
              )}

              {isFacebookLinked ? (
                <View style={styles.linkedAccount}>
                  <Text style={[styles.linkedText, styles[`${theme}Text`]]}>
                    ✅ Compte Facebook lié
                  </Text>
                  <TouchableOpacity
                    style={[styles.unlinkButton, styles[`${theme}Button`]]}
                    onPress={() => handleUnlinkProvider("facebook")}
                  >
                    <Text style={[styles.buttonText, styles[`${theme}Text`]]}>
                      Délier
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : !isGoogleLinked && (
                <TouchableOpacity
                  style={[styles.actionButton, styles[`${theme}Button`]]}
                  onPress={() => handleLinkProvider("facebook")}
                >
                  <Text style={[styles.buttonText, styles[`${theme}Text`]]}>
                    Lier avec Facebook
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}

      <Modal
        display={showUsernameModal}
        theme={theme}
        title="Modifier le nom d'utilisateur"
        onClose={() => setShowUsernameModal(false)}
        content={
          <View style={styles.modalContent}>
            <TextInput
              style={[styles.modalInput, styles[`${theme}Input`]]}
              value={newUsername}
              onChangeText={setNewUsername}
              placeholder="Nouveau nom d'utilisateur"
              placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
            />
            <TouchableOpacity
              style={[styles.modalButton, !newUsername.trim() && styles.modalButtonDisabled]}
              disabled={!newUsername.trim()}
              onPress={async () => {
                const success = await handleSaveChanges();
                if (success) setShowUsernameModal(false);
              }}
            >
              <Text style={styles.modalButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <Modal
        display={showPasswordModal}
        theme={theme}
        title="Modifier le mot de passe"
        onClose={() => setShowPasswordModal(false)}
        content={
          <View style={styles.modalContent}>
            <TextInput
              style={[styles.modalInput, styles[`${theme}Input`]]}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nouveau mot de passe"
              placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
              secureTextEntry
            />
            <TouchableOpacity
              style={[styles.modalButton, !newPassword.trim() && styles.modalButtonDisabled]}
              disabled={!newPassword.trim()}
              onPress={async () => {
                const success = await handleSaveChanges();
                if (success) setShowPasswordModal(false);
              }}
            >
              <Text style={styles.modalButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </ScrollView>
  );
};

export default SettingsPage;