import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderWidth: 3,
        borderColor: '#333',
        borderRadius: 16,
        backgroundColor: '#e5e2d3',
        shadowColor: '#333',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    textLight: {
        color: '#333',
    },
    textDark: {
        color: '#fffceb',
    },
    icon: {
        marginRight: 8,
    },
    light: {
        backgroundColor: '#e5e2d3',
    },
    dark: {
        backgroundColor: '#3D3D3D',
    },
    disabled: {
        opacity: 0.3,
    },
    pressed: {
        borderColor: '#f77066',
        shadowColor: '#f77066',
    },
});