import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  privacyContainer: {
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
  privacyBox: {
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  section: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  line: {
    color: '#333',
    marginBottom: 10,
  },
  paragraph: {
    marginTop: 8,
    fontWeight: 'bold',
    color: '#333',
    fontSize: 14,
    lineHeight: 20,
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
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
});