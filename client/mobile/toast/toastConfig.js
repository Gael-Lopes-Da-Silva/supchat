import React from 'react';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

// Couleurs par défaut :
const successColor = '#00C851'; // vert
const errorColor = '#ff4444';   // rouge
// Couleurs de fond plus claires
const successBgColor = '#E6F9ED'; // vert clair
const errorBgColor = '#FFE8E8';   // rouge clair

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: successBgColor,
        borderRadius: 8,
      }}
      contentContainerStyle={{ 
        paddingHorizontal: 15,
      }}
      text1Style={{
        color: successColor,
        fontWeight: 'bold',
      }}
      text2Style={{
        color: successColor,
      }}
      text1NumberOfLines={3}
      text2NumberOfLines={5}
    />
  ),

  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        backgroundColor: errorBgColor,
        borderRadius: 8,
      }}
      contentContainerStyle={{ 
        paddingHorizontal: 15,
      }}
      text1Style={{
        color: errorColor,
        fontWeight: 'bold',
      }}
      text2Style={{
        color: errorColor,
      }}
      text1NumberOfLines={3}
      text2NumberOfLines={5}
    />
  ),
};
