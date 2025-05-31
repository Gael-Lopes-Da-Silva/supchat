import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../toast/toastConfig';

export default function Layout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
      </Stack>
      <Toast config={toastConfig} />
    </>
  );
}
