import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image, Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.apiUrl;
const CLIENT_WEB_URL = Constants.expoConfig.extra.clientWebUrl;

export default function RegisterScreen() {
  const router = useRouter();

  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(false);

  const handleRegister = async () => {
    if (!pseudo || !email || !password || !accepted) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs et accepter les conditions.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: pseudo, email, password })
      });

      const data = await res.json();

      if (data.error !== 0) {
        let msg = 'Une erreur est survenue lors de l\'inscription.';
        switch (data.error) {
          case 4:
            msg = 'Ce pseudo est déjà utilisé.';
            break;
          case 5:
            msg = 'Cet email est déjà utilisé.';
            break;
        }
        Alert.alert('Erreur', msg);
        return;
      }

      const confirmToken = data?.result?.user?.confirm_token;

      if (!confirmToken) {
        Alert.alert('Erreur', 'Erreur lors de la récupération du token de confirmation.');
        return;
      }

      // Appel à l'API email (si possible)
      await fetch(`${API_URL}email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: '[Supchat] Confirmation de votre compte',
          content: `
                  <p>Bonjour 👋,</p>

                  <p>Bienvenue sur <strong>Supchat</strong> ! 🎉 Nous sommes ravis de vous voir parmi nous.</p>

                  <p>Pour activer votre compte et commencer à discuter, cliquez sur le bouton ci-dessous :</p>

                  <a href="${CLIENT_WEB_URL}accountConfirmed?confirm_token=${confirmToken}&api_url=${API_URL}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #fff; text-decoration: none; font-weight: bold; border-radius: 5px;">
                      Activer mon compte
                  </a>

                  <p>Si vous n’êtes pas à l’origine de cette inscription, pas de souci ! Vous pouvez simplement ignorer cet e-mail. 🚀</p>

                  <p>À bientôt sur Supchat ! 🚀</p>
                  <p>— L’équipe Supchat</p>
                `
        })
      });

      Alert.alert('Succès', 'Compte créé. Vérifie ton e-mail pour confirmer ton compte.');
      router.replace('/screens/login');
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur inattendue est survenue:'+error);
    }
  };

  return (
    <View style={styles.page}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
      <View style={styles.formWrapper}>
        <Text style={styles.title}>Création d’un compte</Text>

        <Text style={styles.label}>Pseudo <Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={pseudo}
          onChangeText={setPseudo}
          placeholder="Entrez un pseudo"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Email <Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Entrez votre e-mail"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Mot de passe <Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Entrez un mot de passe"
          placeholderTextColor="#aaa"
          secureTextEntry
        />

        <View style={styles.termsRow}>
          <Switch
            value={accepted}
            onValueChange={setAccepted}
            thumbColor={accepted ? '#f77066' : '#666'}
          />
          <Text style={styles.termsText}>
            J’accepte les{' '}
            <Text style={styles.link} onPress={() => router.push('/screens/terms')}>conditions d’utilisation</Text> et la{' '}
            <Text style={styles.link} onPress={() => router.push('/screens/privacy')}>politique de confidentialité</Text>.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, !accepted && styles.disabledButton]}
          onPress={handleRegister}
          disabled={!accepted}
        >
          <Text style={styles.buttonText}>S’enregistrer</Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Déjà un compte ?{' '}
          <Text style={styles.loginLink} onPress={() => router.replace('/screens/login')}>
            Se connecter maintenant !
          </Text>
        </Text>
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
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  termsText: {
    color: '#fff',
    marginLeft: 10,
    flex: 1,
    fontSize: 13,
  },
  link: {
    color: '#f77066',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 13,
  },
  loginLink: {
    color: '#ff7a7a',
    fontWeight: 'bold',
  },
});