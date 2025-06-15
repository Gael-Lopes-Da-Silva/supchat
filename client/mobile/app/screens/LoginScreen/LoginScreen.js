import { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { FontAwesome6, FontAwesome } from '@expo/vector-icons';
import { jwtDecode } from 'jwt-decode';
import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';
import * as WebBrowser from 'expo-web-browser';

import Button from '../../components/Button/Button';
import InputField from '../../components/InputField/InputField';
import Link from '../../components/Link/Link';
import styles from './LoginScreenStyles';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import socket from '../../socket';

import { loginUser } from '../../../services/Users';

WebBrowser.maybeCompleteAuthSession();

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [theme] = useState('light');
  const router = useRouter();

  useEffect(() => {
    
    const token = null; 
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        AsyncStorage.setItem("user", JSON.stringify({
          token: token,
          data: decodedToken,
        }));
        router.replace('/screens/DashboardScreen/DashboardScreen');
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Token invalide',
        });
      }
    }
  }, []);

  const handleSubmit = async () => {
    try {
      const data = await loginUser({ email, password });
      if (data.error !== 0) {
        Toast.show({
          type: 'error', 
          text1: `Erreur de connexion ${data.error_message}`,
        });
        return;
      }

      if (!data.token) {
        Toast.show({
          type: 'error', 
          text1: 'Aucun token retourné',
        });
        return;
      }

      const decodedToken = jwtDecode(data.token);
      await AsyncStorage.setItem("user", JSON.stringify({
        token: data.token,
        data: decodedToken,
      }));

      if (!socket.connected) {
        socket.connect();
      }
      socket.emit("registerUser", decodedToken.id);
      socket.emit("getUserWorkspaces", { user_id: decodedToken.id });

      router.replace('/screens/DashboardScreen/DashboardScreen');
    } catch (error) {
      Toast.show({
        type: 'error', 
        text1: `Erreur inattendue ${error}`,
      });
    }
  };

  const handleGoogle = async () => {
    
  };

  const handleFacebook = async () => {
    
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
          <Link text="Mot de passe oublié ?" onClick={() => router.push('/screens/ResetPasswordScreen/ResetPasswordScreen')} />
        </View>
        <View>
          <Button type="submit" text="Se connecter" theme={theme} onClick={handleSubmit} />
          <Link text="Pas de compte ? En créer un maintenant !" onClick={() => router.push('/screens/RegisterScreen/RegisterScreen')} />
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