import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  light: {
    backgroundColor: '#f77066',
  },
  dark: {
    backgroundColor: '#4d4d4d',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
    gap: 12,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  logoText: {
    marginLeft: 12,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  box: {
    borderWidth: 3,
    borderColor: '#333',
    borderRadius: 16,
    padding: 24,
    maxWidth: 400,
    width: '100%',
    backgroundColor: '#fffceb',
    shadowColor: '#333',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
    color: '#333',
    marginBottom: 16,
  },
  footerText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  link: {
    color: '#f77066',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});