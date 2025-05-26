import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  light: {
    backgroundColor: '#fffceb',
  },
  dark: {
    backgroundColor: '#4d4d4d',
  },
  leftPanel: {
    width: '30%',
    padding: 16,
    borderWidth: 3,
    borderColor: '#333',
    borderRadius: 16,
    shadowColor: '#333',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 6,
    backgroundColor: '#e5e2d3',
  },
  categoryBox: {
    padding: 10,
    borderWidth: 3,
    borderRadius: 16,
    borderColor: '#333',
    backgroundColor: '#ccc9bc',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  link: {
    color: '#f77066',
    fontWeight: 'bold',
    marginTop: 4,
  },
  rightPanel: {
    flex: 1,
    padding: 16,
    borderWidth: 3,
    borderColor: '#333',
    borderRadius: 16,
    shadowColor: '#333',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 6,
    backgroundColor: '#e5e2d3',
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});