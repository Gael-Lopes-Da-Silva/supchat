import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  light: {
    backgroundColor: '#FEFCEB',
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
    width: '90%',
    maxWidth: 400,
    padding: 24,
    borderWidth: 3,
    borderColor: '#333',
    borderRadius: 16,
    backgroundColor: '#fffceb',
    shadowColor: '#333',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  socials: {
    marginTop: 16,
    gap: 12,
  },
});