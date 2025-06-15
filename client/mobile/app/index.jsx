import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import 'react-native-gesture-handler';

export default function App() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        const storedData = await AsyncStorage.getItem('user');
        const userData = JSON.parse(storedData);
        const token = userData?.token;

        if (!token) {
          router.replace('/screens/LoginScreen/LoginScreen');
          return;
        }

        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          await AsyncStorage.removeItem('user');
          router.replace('/screens/LoginScreen/LoginScreen');
          return;
        }

        router.replace('/screens/DashboardScreen/DashboardScreen');
      } catch (error) {
        await AsyncStorage.removeItem('user');
        router.replace('/screens/LoginScreen/LoginScreen');
      }
    };

    const delayNavigation = async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      checkAuthAndNavigate();
    };
    
    delayNavigation();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#f77066" />
    </View>
  );
}
