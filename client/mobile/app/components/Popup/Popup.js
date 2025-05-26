import { View, StyleSheet } from 'react-native';
import styles from './PopupStyles';

const Popup = ({ content, display, theme = "light" }) => {
  if (!display) return null;

  const isDark = theme === 'dark';

  return (
    <View style={[styles.popup, isDark ? styles.dark : styles.light]}>
      {content}
    </View>
  );
};

export default Popup;