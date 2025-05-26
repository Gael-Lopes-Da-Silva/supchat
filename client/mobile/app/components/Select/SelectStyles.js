import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  selectContainer: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#333',
    marginBottom: 12,
    shadowColor: '#333',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  picker: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  light: {
    backgroundColor: '#fffceb',
    color: '#333',
  },
  dark: {
    backgroundColor: '#4d4d4d',
    color: '#fffceb',
  },
});