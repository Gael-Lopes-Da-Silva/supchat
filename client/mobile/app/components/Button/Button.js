import { TouchableOpacity, Text, View } from 'react-native';
import styles from './ButtonStyles';

const Button = ({ text, type, icon, disabled, theme = "light", onClick }) => {
    const isDark = theme === "dark";

    return (
        <TouchableOpacity
            style={[
                styles.button,
                isDark ? styles.dark : styles.light,
                disabled && styles.disabled
            ]}
            disabled={disabled}
            onPress={onClick}
        >
            <View style={styles.content}>
                {icon && <View style={styles.icon}>{icon}</View>}
                <Text style={[styles.text, isDark ? styles.textDark : styles.textLight]}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default Button;