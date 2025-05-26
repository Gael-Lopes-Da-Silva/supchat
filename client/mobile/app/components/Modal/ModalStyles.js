import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0000004f',
  },
  modalBox: {
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#333',
    padding: 16,
    width: '90%',
    shadowColor: '#333',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 10,
  },
  lightBox: {
    backgroundColor: '#fffceb',
  },
  darkBox: {
    backgroundColor: '#4d4d4d',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#333',
    padding: 10,
    marginBottom: 16,
  },
  headerLight: {
    backgroundColor: '#e5e2d3',
  },
  headerDark: {
    backgroundColor: '#3d3d3d',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  button: {
    padding: 6,
    borderRadius: 10,
  },
  icon: {
    fontSize: 20,
  },
  iconLight: {
    color: '#333',
  },
  iconDark: {
    color: '#fffceb',
  },
});