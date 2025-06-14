import { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';

import Button from '../../components/Button/Button';
import InputField from '../../components/InputField/InputField';
import Link from '../../components/Link/Link';

import { readUser } from '../../../services/Users';
import { sendEmail } from '../../../services/Email';
import * as PasswordReset from '../../../emails/PasswordReset';

import styles from './ResetPasswordScreenStyles';

const API_URL = Constants.expoConfig.extra.apiUrl;
const WEB_URL = Constants.expoConfig.extra.clientWebUrl;

const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [theme] = useState('light');
    const router = useRouter();

    const handleCheckEmail = async () => {
        try {
            const data = await readUser({email}, API_URL);

            if (data.error || !data.result) {
                Toast.show({
                    type: 'error',
                    text1: 'E-mail non valide.',
                });
                return;
            }

            const user = data.result[0];
            if (user.provider) {
                Toast.show({
                    type: 'error',
                    text1: 'Ce compte utilise une connexion externe.',
                });
                return;
            }

            // Générer un token unique pour la réinitialisation
            const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            
            // Construire l'URL complète de réinitialisation
            const resetUrl = `${WEB_URL}reset_password?token=${resetToken}&email=${encodeURIComponent(email)}`;
            
            const emailResponse = await sendEmail({
                to: user.email,
                subject: PasswordReset.subject(),
                content: PasswordReset.content(resetUrl),
            }, null);

            if (emailResponse.error) {
                Toast.show({
                    type: 'error',
                    text1: 'Erreur lors de l\'envoi de l\'email',
                    text2: emailResponse.error_message || 'Une erreur inattendue est survenue.',
                });
                return;
            }

            Toast.show({
                type: 'success',
                text1: 'Un mail de modification de mot de passe vous a été envoyé.',
                text2: 'Veuillez vérifier votre boîte mail.',
            });

            router.replace('/screens/LoginScreen/LoginScreen');
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Une erreur inattendue est survenue.',
            });

            if (process.env.REACT_APP_DEBUG) {
                console.trace({
                    from: "readUser() -> ResetPasswordScreen.js",
                    error: error,
                });
            }
        }
    };

    return (
        <View style={[styles.container, styles[theme]]}>
            <View style={styles.logoContainer}>
                <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
                <Text style={styles.logoText}>Supchat</Text>
            </View>
            <View style={styles.box}>
                <Text style={styles.title}>Vérification de l'adresse mail</Text>
                <InputField
                    label="E-mail"
                    type="email"
                    theme={theme}
                    value={email}
                    required
                    onChange={setEmail}
                />
                <Button type="submit" text="Vérifier" theme={theme} onClick={handleCheckEmail} />
                <Link text="Retour à la connexion" onClick={() => router.replace('/screens/LoginScreen/LoginScreen')} />
            </View>
        </View>
    );
};

export default ResetPasswordPage;