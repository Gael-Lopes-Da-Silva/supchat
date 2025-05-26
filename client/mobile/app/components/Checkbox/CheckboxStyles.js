import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  label: {
    fontSize: 16,
  },
  textLight: {
    color: '#333',
  },
  textDark: {
    color: '#fffceb',
  },
  switch: {
    width: 40,
    height: 20,
    minWidth: 40,
  },
  track: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#e5e2d3',
    justifyContent: 'center',
    shadowColor: '#333',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  trackLight: {
    backgroundColor: '#e5e2d3',
  },
  trackDark: {
    backgroundColor: '#4d4d4d',
  },
  trackActive: {
    backgroundColor: '#f77066',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e5e2d3',
    borderWidth: 2,
    borderColor: '#333',
    position: 'absolute',
    left: -2,
    bottom: -2,
    transform: [{ translateY: -2 }],
  },
  thumbChecked: {
    transform: [{ translateX: 20 }, { translateY: -2 }],
  },
  thumbLight: {
    backgroundColor: '#e5e2d3',
  },
  thumbDark: {
    backgroundColor: '#4d4d4d',
  },
});