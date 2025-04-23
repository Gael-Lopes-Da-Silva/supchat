import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000';

export default function DashboardScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('user');
      const parsed = stored ? JSON.parse(stored) : null;
      if (!parsed || !parsed.data) {
        router.replace('/screens/login');
        return;
      }
      setUser(parsed.data);

      // récupérer les workspaces de l'utilisateur
      fetch(`${API_URL}/users/${parsed.data.id}/workspaces`)
        .then(res => res.json())
        .then(data => {
          setWorkspaces(data.result || []);
          if (data.result?.length) {
            setSelectedWorkspace(data.result[0]);
          }
        });
    })();
  }, []);

  useEffect(() => {
    if (selectedWorkspace?.id) {
      fetch(`${API_URL}/channels?workspace_id=${selectedWorkspace.id}`)
        .then(res => res.json())
        .then(data => {
          setChannels(data.result || []);
          if (data.result?.length) {
            setSelectedChannel(data.result[0]);
          }
        });
    }
  }, [selectedWorkspace]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    Alert.alert("Message envoyé", message);
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <Text style={styles.subtitle}>Mes espaces de travail</Text>
      <FlatList
        horizontal
        data={workspaces}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.workspaceButton,
              selectedWorkspace?.id === item.id && styles.selectedButton,
            ]}
            onPress={() => setSelectedWorkspace(item)}
          >
            <Text style={styles.buttonText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.subtitle}>Channels</Text>
      <FlatList
        data={channels}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.channelButton,
              selectedChannel?.id === item.id && styles.selectedButton,
            ]}
            onPress={() => setSelectedChannel(item)}
          >
            <Text style={styles.buttonText}>#{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Envoyer un message..."
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
        <Text style={styles.buttonText}>Envoyer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffceb',
    padding: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#444',
  },
  workspaceButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  channelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedButton: {
    backgroundColor: '#f77066',
  },
  buttonText: {
    color: '#222',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 12,
    marginTop: 20,
    marginBottom: 10,
    color: '#000',
  },
  sendButton: {
    backgroundColor: '#f77066',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
});