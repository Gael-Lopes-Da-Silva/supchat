import { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { FontAwesome6, FontAwesome } from '@expo/vector-icons';
import { jwtDecode } from 'jwt-decode';
import Constants from 'expo-constants';

import Button from '../../components/Button/Button';
import InputField from '../../components/InputField/InputField';
import Link from '../../components/Link/Link';
import styles from './LoginPageStyles';
import { useRouter } from 'expo-router';

import { loginUser, updateUser } from '../../../services/Users';

const API_URL = Constants.expoConfig.extra.apiUrl;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [theme] = useState('light');
  const router = useRouter();

  useEffect(() => {
    // Login auto à partir d'un token passé par URL
    const token = null; // Pas d'URL en RN, pourrait venir d'un deep link ou autre
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        AsyncStorage.setItem("user", JSON.stringify({
          token: token,
          data: decodedToken,
        }));
        router.replace('/screens/DashboardScreen/DashboardPage');
      } catch (error) {
        console.warn("Token invalide");
      }
    }
  }, []);

  const handleSubmit = async () => {
    try {
      const data = await loginUser({ email, password });

      if (data.error !== 0) {
        console.warn("Erreur de connexion", data.error);
        return;
      }

      if (!data.token) {
        console.warn("Aucun token retourné");
        return;
      }

      if (data.result.password_reset_token !== null) {
        await updateUser(data.result.id, { password_reset_token: null });
      }

      const decodedToken = jwtDecode(data.token);
      AsyncStorage.setItem("user", JSON.stringify({
        token: data.token,
        data: decodedToken,
      }));

      router.replace('/screens/DashboardScreen/DashboardPage');
    } catch (error) {
      console.warn("Erreur inattendue", error);
    }
  };

  const handleGoogle = () => {
    Linking.openURL(`${API_URL}/users/auth/google`);
  };

  const handleFacebook = () => {
    Linking.openURL(`https://www.facebook.com/v15.0/dialog/oauth?client_id=FACEBOOK_CLIENT_ID&redirect_uri=${API_URL}/users/auth/facebook/callback&scope=email`);
  };

  return (
    <View style={[styles.container, theme === "dark" ? styles.dark : styles.light]}>
      <View style={styles.logoContainer}>
        <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.logoText}>Supchat</Text>
      </View>
      <View style={styles.box}>
        <Text style={styles.title}>Connexion</Text>
        <View>
          <InputField
            label="E-mail"
            type="email"
            theme={theme}
            value={email}
            required
            onChange={setEmail}
          />
          <InputField
            label="Mot de passe"
            type="password"
            theme={theme}
            value={password}
            required
            onChange={setPassword}
          />
          <Link text="Mot de passe oublié ?" onClick={() => router.push('/screens/ResetPasswordScreen/ResetPasswordPage')} />
        </View>
        <View>
          <Button type="submit" text="Se connecter" theme={theme} onClick={handleSubmit} />
          <Link text="Pas de compte ? En créer un maintenant !" onClick={() => router.push('/screens/RegisterScreen/RegisterPage')} />
        </View>
        <View style={styles.socials}>
          <Button icon={<FontAwesome6 name="google" size={20} />} onClick={handleGoogle} type="button" text="Google" theme={theme} />
          <Button icon={<FontAwesome name="facebook-f" size={20} color="#4267B2" />} onClick={handleFacebook} type="button" text="Facebook" theme={theme} />
        </View>
      </View>
    </View>
  );
};

export default LoginPage;