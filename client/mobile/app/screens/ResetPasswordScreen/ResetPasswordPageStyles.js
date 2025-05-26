import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  light: {
    backgroundColor: '#fffceb',
  },
  dark: {
    backgroundColor: '#4d4d4d',
  },
  logoContainer: {
    position: 'absolute',
    top: 20,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#fff',
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
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
    gap: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  footerText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  link: {
    color: '#f77066',
    textDecorationLine: 'underline',
  },
});