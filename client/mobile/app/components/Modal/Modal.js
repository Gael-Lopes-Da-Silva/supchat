import { View, Text, Pressable, Modal as RNModal } from 'react-native';
import styles from './ModalStyles';

const Modal = ({ content, display, goBack, title = "", theme = "light", onClose, onGoBack }) => {
  const isDark = theme === 'dark';

  return (
    <RNModal
      visible={display}
      transparent={true}
      animationType="fade"
    >
      <View style={[styles.modalContainer, isDark ? styles.darkBackground : styles.lightBackground]}>
        <View style={[styles.modalBox, isDark ? styles.darkBox : styles.lightBox]}>
          <View style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}>
            <View style={styles.headerButtons}>
              {goBack && (
                <Pressable onPress={onGoBack} style={styles.button}>
                  <Text style={[styles.icon, isDark ? styles.iconDark : styles.iconLight]}>{'<'}</Text>
                </Pressable>
              )}
            </View>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.headerButtons}>
              <Pressable onPress={onClose} style={styles.button}>
                <Text style={[styles.icon, isDark ? styles.iconDark : styles.iconLight]}>×</Text>
              </Pressable>
            </View>
          </View>
          <View style={{ padding: 10 }}>{content}</View>
        </View>
      </View>
    </RNModal>
  );
};

export default Modal;