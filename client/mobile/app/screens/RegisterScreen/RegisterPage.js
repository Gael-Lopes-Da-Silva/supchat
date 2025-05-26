import { useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import Button from '../../components/Button/Button';
import Checkbox from '../../components/Checkbox/Checkbox';
import InputField from '../../components/InputField/InputField';
import Link from '../../components/Link/Link';
import styles from './RegisterPageStyles';
import { useRouter } from 'expo-router';

import { createUser } from '../../../services/Users';
import { sendEmail } from '../../../services/Email';
import * as ConfirmationEmail from '../../../emails/Confirmation';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [theme] = useState('light');
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const data = await createUser({ username, email, password });

      if (data.error !== 0) {
        console.warn("Erreur:", data.error);
        return;
      }

      const confirmToken = data.result.user.confirm_token;

      if (!confirmToken) {
        console.warn("Token de confirmation manquant");
        return;
      }

      await sendEmail({
        to: email,
        subject: ConfirmationEmail.subject(),
        content: ConfirmationEmail.content(confirmToken),
      });

      console.log("Email envoyé avec succès");
      router.replace('/screens/LoginScreen/LoginPage');
    } catch (error) {
      console.warn("Erreur lors de l'inscription", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, styles[theme]]}>
      <View style={styles.logoContainer}>
        <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.logoText}>Supchat</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.title}>Création d'un compte</Text>

        <InputField
          label="Pseudo"
          theme={theme}
          type="text"
          value={username}
          required
          onChange={setUsername}
        />
        <InputField
          label="Email"
          theme={theme}
          type="email"
          value={email}
          required
          onChange={setEmail}
        />
        <InputField
          label="Mot de passe"
          theme={theme}
          type="password"
          value={password}
          required
          onChange={setPassword}
        />

        <View style={styles.checkboxContainer}>
          <Checkbox
            theme={theme}
            onChange={() => setChecked(!checked)}
            required={true}
            label={
              <Text style={styles.termsText}>
                J'ai lu et j'accepte les{" "}
                <Text style={styles.link} onPress={() => router.push('/screens/TermsScreen/TermsPage')}>conditions d'utilisation</Text>{" "}
                et la{" "}
                <Text style={styles.link} onPress={() => router.push('/screens/PrivacyScreen/PrivacyPage')}>politique de confidentialité</Text>{" "}
                de Supchat.
              </Text>
            }
          />
        </View>

        <Button type="submit" text="S'enregistrer" theme={theme} disabled={!checked} onClick={handleSubmit} />
        <Text style={styles.termsText}>
          Déjà un compte ? <Text style={styles.link} onPress={() => router.replace('/screens/LoginScreen/LoginPage')}>Se connecter maintenant !</Text>
        </Text>
      </View>
    </ScrollView >
  );
};

export default RegisterPage;