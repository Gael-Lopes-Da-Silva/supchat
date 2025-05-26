import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  termsContainer: {
    flexGrow: 1,
    margin: 16,
    borderWidth: 3,
    borderColor: '#333',
    padding: 16,
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
  termsBox: {
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  line: {
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  section: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  link: {
    color: '#f77066',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 24,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});