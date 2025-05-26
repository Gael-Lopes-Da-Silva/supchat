import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  privacyContainer: {
    flexGrow: 1,
    margin: 16,
    padding: 16,
    borderWidth: 3,
    borderColor: '#333',
    borderRadius: 12,
    shadowColor: '#333',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  light: {
    backgroundColor: '#fffceb',
    color: '#333',
  },
  dark: {
    backgroundColor: '#4d4d4d',
    color: '#fffceb',
  },
  privacyBox: {
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  section: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: 'bold',
  },
  line: {
    color: '#000',
    marginBottom: 10,
  },
  paragraph: {
    marginTop: 6,
    fontWeight: 'bold',
  },
  link: {
    fontWeight: 'bold',
    color: '#f77066',
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 24,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});