import { View, Text, TextInput } from 'react-native';
import styles from './InputFieldStyles';

const InputField = ({ label, type, value, required, theme = "light", onChange }) => {
  const isDark = theme === "dark";

  return (
    <View style={styles.inputField}>
      <Text style={[styles.label, isDark ? styles.labelDark : styles.labelLight]}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
        value={value}
        onChangeText={onChange}
        secureTextEntry={type === 'password'}
        keyboardType={type === 'email' ? 'email-address' : 'default'}
        autoCapitalize="none"
      />
    </View>
  );
};

export default InputField;