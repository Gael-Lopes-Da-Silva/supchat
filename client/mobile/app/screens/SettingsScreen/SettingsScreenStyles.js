import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  light: {
    backgroundColor: '#E4E2D2',
  },
  dark: {
    backgroundColor: '#4d4d4d',
  },
  lightText: {
    color: '#333',
  },
  darkText: {
    color: '#fffceb',
  },
  lightSection: {
    backgroundColor: '#e5e2d3',
    borderColor: '#333',
  },
  darkSection: {
    backgroundColor: '#3D3D3D',
    borderColor: '#fffceb',
  },
  lightButton: {
    backgroundColor: '#e5e2d3',
  },
  darkButton: {
    backgroundColor: '#3D3D3D',
  },
  lightInput: {
    backgroundColor: '#fffceb',
    color: '#333',
  },
  darkInput: {
    backgroundColor: '#4d4d4d',
    color: '#fffceb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    gap: 16,
  },
  section: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 3,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#333',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    width: 140,
  },
  value: {
    flex: 1,
  },
  themeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  themeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
    minWidth: 120,
    alignItems: 'center',
  },
  themeButtonActive: {
    backgroundColor: '#007AFF22',
  },
  statusButtons: {
    gap: 8,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#007AFF22',
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  linkedAccount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  linkedText: {
    fontWeight: 'bold',
  },
  unlinkButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#F67066',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    borderWidth: 3,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#333',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  lightModal: {
    backgroundColor: '#e5e2d3',
    borderColor: '#333',
  },
  darkModal: {
    backgroundColor: '#3D3D3D',
    borderColor: '#fffceb',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalInput: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#23A55A',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#333',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  modalButtonDisabled: {
    opacity: 0.6,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});