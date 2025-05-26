import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    button: {
        padding: 12,
        borderWidth: 3,
        borderColor: '#333',
        borderRadius: 16,
        shadowColor: '#333',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    light: {
        backgroundColor: '#e5e2d3',
    },
    dark: {
        backgroundColor: '#3D3D3D',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    textLight: {
        color: '#333',
    },
    textDark: {
        color: '#fffceb',
    },
    disabled: {
        opacity: 0.3,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 6,
    },
});