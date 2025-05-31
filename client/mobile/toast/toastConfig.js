import React from 'react';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

// Couleurs par défaut :
const successColor = '#00C851'; // vert
const errorColor = '#ff4444';   // rouge

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: successColor }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1NumberOfLines={3}
      text2NumberOfLines={5}
    />
  ),

  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: errorColor }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1NumberOfLines={3}
      text2NumberOfLines={5}
    />
  ),
};
