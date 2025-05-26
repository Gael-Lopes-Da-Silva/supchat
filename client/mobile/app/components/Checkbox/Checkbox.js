import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';
import styles from './CheckboxStyles';

const Checkbox = ({ label, theme = "light", required, onChange }) => {
  const [checked, setChecked] = useState(false);
  const isDark = theme === "dark";

  const toggleCheckbox = () => {
    const newValue = !checked;
    setChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <View style={[styles.checkbox, isDark ? styles.dark : styles.light]}>
      <Pressable onPress={toggleCheckbox} style={styles.switch}>
        <View style={[
          styles.track,
          checked && styles.trackActive,
          isDark ? styles.trackDark : styles.trackLight
        ]}>
          <View style={[
            styles.thumb,
            checked && styles.thumbChecked,
            isDark ? styles.thumbDark : styles.thumbLight
          ]} />
        </View>
      </Pressable>
      <Text style={[styles.label, isDark ? styles.textDark : styles.textLight]}>{label}</Text>
    </View>
  );
};

export default Checkbox;