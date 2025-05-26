import { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Button from '../../components/Button/Button';
import InputField from '../../components/InputField/InputField';
import Link from '../../components/Link/Link';
import styles from './ResetPasswordPageStyles';
import { useRouter } from 'expo-router';

import * as PasswordReset from '../../../emails/PasswordReset';
import * as PostPasswordReset from '../../../emails/PostPasswordReset';

import { sendEmail } from '../../../services/Email';
import { readUser, updateUser } from '../../../services/Users';

const ResetPasswordPage = ({ route }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [checkMail, setCheckMail] = useState(false);
  const [user, setUser] = useState('');
  const [theme] = useState('light'); // ajuster selon le contexte
  const router = useRouter();

  useEffect(() => {
    const token = route?.params?.token || null;
    if (token) {
      setCheckMail(true);
      readUser({ password_reset_token: token }).then((data) => {
        const [foundUser] = data.result;
        if (!foundUser) router.push('/screens/LoginScreen/LoginPage');
        setUser(foundUser);
      }).catch(() => {
        console.warn("Erreur lors de la récupération de l'utilisateur.");
      });
    }

    AsyncStorage.getItem('user').then((userData) => {
      if (userData) router.push('/screens/DashboardScreen/DashboardPage');
    });
  }, []);

  const handleResetPassword = async () => {
    if (password !== checkPassword) {
      console.warn("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await updateUser(user.id, { password, reset_password_token: null });
      await sendEmail({
        to: user.email,
        subject: PostPasswordReset.subject(),
        content: PostPasswordReset.content(),
      });
      router.push('/screens/LoginScreen/LoginPage');
    } catch (error) {
      console.warn("Erreur de réinitialisation", error);
    }
  };

  const handleCheckEmail = async () => {
    try {
      const data = await readUser({ email, provider: "local" });
      const [foundUser] = data.result;
      if (!foundUser) {
        console.warn("E-mail non valide.");
        return;
      }

      await updateUser(foundUser.id, { password_reset_token: "random" });

      const confirmData = await readUser({ email });
      const [confirmedUser] = confirmData.result;

      await sendEmail({
        to: confirmedUser.email,
        subject: PasswordReset.subject(),
        content: PasswordReset.content(confirmedUser.password_reset_token),
      });

      router.push('/screens/LoginScreen/LoginPage');
    } catch (error) {
      console.warn("Erreur lors de l'envoi de l'e-mail", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, styles[theme]]}>
      <TouchableOpacity style={styles.logoContainer} onPress={() => router.push('/screens/LoginScreen/LoginPage')}>
        <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.logoText}>Supchat</Text>
      </TouchableOpacity>

      {!checkMail ? (
        <View style={styles.box}>
          <Text style={styles.title}>Vérification de l'adresse mail</Text>
          <InputField
            label="Email"
            type="email"
            theme={theme}
            value={email}
            required={true}
            onChange={setEmail}
          />
          <Button type="submit" text="Enregistrer" theme={theme} onClick={handleCheckEmail} />
          <Text style={styles.footerText}>
            Pas de compte ? <Text style={styles.link} onPress={() => router.push('/screens/RegisterScreen/RegisterPage')}>En créer un maintenant !</Text>
          </Text>
        </View>
      ) : (
        <View style={styles.box}>
          <Text style={styles.title}>Réinitialisation de mot de passe</Text>
          <InputField
            label="Mot de passe"
            type="password"
            theme={theme}
            value={password}
            required={true}
            onChange={setPassword}
          />
          <InputField
            label="Confirmez le mot de passe"
            type="password"
            theme={theme}
            value={checkPassword}
            required={true}
            onChange={setCheckPassword}
          />
          <Button type="submit" text="Enregistrer" theme={theme} onClick={handleResetPassword} />
        </View>
      )}
    </ScrollView>
  );
};

export default ResetPasswordPage;