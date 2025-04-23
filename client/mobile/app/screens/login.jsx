import React, { useState } from 'react';
import {
  View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Alert, Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:3000';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.error !== 0) {
        let msg = 'Erreur inconnue.';
        switch (data.error) {
          case 9:
            msg = 'E-mail non valide.';
            break;
          case 10:
            msg = 'Mot de passe incorrect.';
            break;
          case 54:
            msg = 'Veuillez confirmer votre email.';
            break;
        }
        Alert.alert('Erreur', msg);
        return;
      }

      if (!data.token) {
        Alert.alert('Erreur', 'Connexion échouée, réessayez.');
        return;
      }

      // Supprimer le reset token si présent
      if (data.result?.password_reset_token) {
        await fetch(`${API_URL}/users/\${data.result.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password_reset_token: null })
        });
      }

      const decoded = jwtDecode(data.token);
      await AsyncStorage.setItem('user', JSON.stringify({ token: data.token, data: decoded }));

      router.replace('/screens/dashboard');
    } catch (err) {
      Alert.alert('Erreur', 'Erreur serveur ou réseau.');
    }
  };

  const handleGoogle = () => {
    Linking.openURL(`${API_URL}/users/auth/google`);
  };

  const handleFacebook = () => {
    Linking.openURL(`https://www.facebook.com/v15.0/dialog/oauth?client_id=FACEBOOK_CLIENT_ID&redirect_uri=${API_URL}/users/auth/facebook/callback&scope=email`);
  };

  return (
    <View style={styles.page}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
      <View style={styles.formWrapper}>
        <Text style={styles.title}>Connexion</Text>

        <Text style={styles.label}>E-mail <Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Entrez votre e-mail"
          placeholderTextColor="#aaa"
          style={styles.input}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Mot de passe <Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Entrez votre mot de passe"
          placeholderTextColor="#aaa"
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity onPress={() => router.push('/screens/reset_password')}>
          <Text style={styles.forgot}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Pas de compte ?{' '}
          <Text style={styles.signupLink} onPress={() => router.push('/screens/register')}>
            En créer un maintenant !
          </Text>
        </Text>

        <TouchableOpacity style={styles.socialButton} onPress={handleGoogle}>
          <FontAwesome name="google" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} onPress={handleFacebook}>
          <FontAwesome name="facebook" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.socialText}>Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f77066',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  formWrapper: {
    backgroundColor: '#333',
    padding: 25,
    borderRadius: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  logo: {
    width: 130,
    height: 130,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#111',
  },
  forgot: {
    color: '#ff7a7a',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  signupText: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  signupLink: {
    color: '#ff7a7a',
    fontWeight: 'bold',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 14,
    borderRadius: 12,
    justifyContent: 'center',
    marginBottom: 10,
  },
  socialText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});