import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsContainer: {
    backgroundColor: '#fffceb',
    width: '90%',
    maxWidth: 400,
    marginVertical: 24,
    paddingHorizontal: 24,
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
    backgroundColor: '#f77066',
  },
  dark: {
    backgroundColor: '#4d4d4d',
  },
  termsBox: {
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  line: {
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  section: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
    color: '#333',
  },
  paragraph: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    lineHeight: 20,
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
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
});