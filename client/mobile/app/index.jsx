import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-gesture-handler';

export default function App() {
  const router = useRouter();

  useEffect(() => {
    const delayNavigation = async () => {
      await new Promise(resolve => setTimeout(resolve, 10)); // petit délai
      router.replace('/screens/LoginScreen/LoginPage');
    };
    delayNavigation();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#f77066" />
    </View>
  );
}
