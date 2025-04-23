import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.apiUrl;
const CLIENT_WEB_URL = Constants.expoConfig.extra.clientWebUrl;

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [checkMail, setCheckMail] = useState(false);
  const [user, setUser] = useState(null);
  const [theme] = useState('light'); // adapter si besoin
  const { password_reset_token } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (password_reset_token) {
      setCheckMail(true);
      fetch(`${API_URL}/users/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password_reset_token }),
      })
        .then((res) => res.json())
        .then((data) => {
          const user = data?.result?.[0];
          if (!user) router.replace('/screens/login');
          setUser(user);
        })
        .catch(() => {
          Alert.alert('Erreur', 'Une erreur inattendue est survenue.');
        });
    }
  }, [password_reset_token]);

  const handleCheckEmail = () => {
    fetch(`${API_URL}/users/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, provider: 'local' }),
    })
      .then((res) => res.json())
      .then((data) => {
        const user = data?.result?.[0];
        if (!user) {
          Alert.alert('Erreur', "E-mail non valide.");
          return;
        }

        fetch(`${API_URL}/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password_reset_token: 'random' }),
        }).then(() => {
          fetch(`${API_URL}/users/read`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          })
            .then((res) => res.json())
            .then((data) => {
              const user = data?.result?.[0];
              fetch(`${API_URL}/email/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  to: user.email,
                  subject: '[Supchat] Réinitialisation de mot de passe',
                  content: `
                    <p>Voici votre lien de réinitialisation :</p>
                    <a href="${CLIENT_WEB_URL}/reset_password?password_reset_token=${user.password_reset_token}">
                      Réinitialiser mon mot de passe
                    </a>
                  `,
                }),
              });

              Alert.alert('Succès', 'Un e-mail de réinitialisation vous a été envoyé.');
              router.replace('/screens/login');
            });
        });
      })
      .catch(() => {
        Alert.alert('Erreur', 'Une erreur est survenue.');
      });
  };

  const handleResetPassword = () => {
    if (password !== checkPassword) {
      Alert.alert('Erreur', 'Les mots de passe sont différents.');
      return;
    }

    fetch(`${API_URL}/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, reset_password_token: null }),
    })
      .then(() => {
        fetch(`${API_URL}/email/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: user.email,
            subject: '[Supchat] Mot de passe mis à jour',
            content: `<p>Votre mot de passe a été réinitialisé avec succès.</p>`,
          }),
        });

        Alert.alert('Succès', 'Mot de passe mis à jour. Vous pouvez vous connecter.');
        router.replace('/screens/login');
      })
      .catch(() => {
        Alert.alert('Erreur', 'Une erreur est survenue.');
      });
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      <View style={styles.box}>
        {!checkMail ? (
          <>
            <Text style={styles.title}>Vérification de l'adresse mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity style={styles.button} onPress={handleCheckEmail}>
              <Text style={styles.buttonText}>Envoyer</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>Réinitialisation de mot de passe</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Nouveau mot de passe"
              secureTextEntry
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.input}
              value={checkPassword}
              onChangeText={setCheckPassword}
              placeholder="Confirmer le mot de passe"
              secureTextEntry
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
              <Text style={styles.buttonText}>Enregistrer</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f77066',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  box: {
    width: '100%',
    backgroundColor: '#fffceb',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#333',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    color: '#000',
  },
  button: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fffceb',
    fontWeight: 'bold',
  },
});

