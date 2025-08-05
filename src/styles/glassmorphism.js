import {StyleSheet} from 'react-native';

export const createGlassmorphismStyles = (isDarkMode) => StyleSheet.create({
  // Base glassmorphism container
  glassContainer: {
    backgroundColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(0, 0, 0, 0.2)',
    shadowColor: isDarkMode ? '#000' : '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: isDarkMode ? 0.25 : 0.15,
    shadowRadius: 16,
    elevation: 8,
  },

  // Dark glassmorphism container (deprecated - use glassContainer with theme)
  glassContainerDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },

  // Card glassmorphism
  glassCard: {
    backgroundColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.15)' 
      : 'rgba(0, 0, 0, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(0, 0, 0, 0.2)',
    padding: 16,
    shadowColor: isDarkMode ? '#000' : '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: isDarkMode ? 0.2 : 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  // Button glassmorphism
  glassButton: {
    backgroundColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.3)' 
      : 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: isDarkMode ? '#000' : '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: isDarkMode ? 0.2 : 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  // Input glassmorphism
  glassInput: {
    backgroundColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: isDarkMode ? '#FFFFFF' : '#000000',
    fontSize: 16,
  },

  // Background gradients
  backgroundGradient: {
    flex: 1,
    backgroundColor: isDarkMode ? '#000000' : '#F5F5F5',
  },

  backgroundGradientLight: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  // Text styles
  glassText: {
    color: isDarkMode ? '#FFFFFF' : '#000000',
    fontSize: 16,
    fontWeight: '500',
  },

  glassTextDark: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },

  glassTitle: {
    color: isDarkMode ? '#FFFFFF' : '#000000',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  glassSubtitle: {
    color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
    fontSize: 16,
    textAlign: 'center',
  },

  // Table glassmorphism
  glassTable: {
    backgroundColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
  },

  glassTableHeader: {
    backgroundColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.1)',
  },

  glassTableRow: {
    backgroundColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'rgba(0, 0, 0, 0.05)',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'rgba(0, 0, 0, 0.05)',
  },

  // Modal glassmorphism
  glassModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  glassModalContent: {
    backgroundColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.15)' 
      : 'rgba(0, 0, 0, 0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(0, 0, 0, 0.2)',
    padding: 24,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
});

