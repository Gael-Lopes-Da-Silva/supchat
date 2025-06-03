import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  label: {
    width: '100%',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
    textAlign: 'left',
  },
  labelLight: {
    color: '#333',
  },
  labelDark: {
    color: '#fffceb',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 3,
    borderColor: '#333',
    borderRadius: 16,
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#e5e2d3',
    shadowColor: '#333',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  inputLight: {
    backgroundColor: '#e5e2d3',
    color: '#333',
  },
  inputDark: {
    backgroundColor: '#3D3D3D',
    color: '#fffceb',
  },
  inputFocused: {
    borderColor: '#f77066',
    shadowColor: '#f77066',
  },
  required: {
    color: 'red',
    marginLeft: 4,
    fontSize: 14,
  },
});