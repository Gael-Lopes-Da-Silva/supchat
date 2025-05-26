import { Text, Pressable } from 'react-native';
import styles from './LinkStyles';

const Link = ({ text, onClick }) => {
  return (
    <Pressable onPress={onClick}>
      {({ pressed }) => (
        <Text style={[styles.link, pressed && styles.linkPressed]}>
          {text}
        </Text>
      )}
    </Pressable>
  );
};

export default Link;