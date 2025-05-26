import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  popup: {
    position: 'absolute',
    top: 32,
    left: '70%',
    transform: [{ translateX: -50 }],
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#333',
    shadowColor: '#333',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 10,
    padding: 10,
  },
  light: {
    backgroundColor: '#ccc9bc',
    color: '#333',
  },
  dark: {
    backgroundColor: '#363636',
    color: '#fffceb',
  },
});