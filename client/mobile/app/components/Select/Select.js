import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from './SelectStyles';

const Select = ({ theme = "light", value, onChange, options }) => {
  const isDark = theme === "dark";

  return (
    <View style={[styles.selectContainer, isDark ? styles.dark : styles.light]}>
      <Picker
        selectedValue={value}
        onValueChange={onChange}
        style={styles.picker}
        dropdownIconColor={isDark ? '#fffceb' : '#333'}
      >
        {options.map((opt) => (
          <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
        ))}
      </Picker>
    </View>
  );
};

export default Select;