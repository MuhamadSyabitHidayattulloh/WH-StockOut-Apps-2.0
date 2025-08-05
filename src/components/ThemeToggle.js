import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../context/ThemeContext';
import {createGlassmorphismStyles} from '../styles/glassmorphism';

const ThemeToggle = ({style}) => {
  const {isDarkMode, themeMode, setTheme} = useTheme();
  const glassmorphismStyles = createGlassmorphismStyles(isDarkMode);

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return 'light-mode';
      case 'dark':
        return 'dark-mode';
      case 'system':
      default:
        return 'settings-brightness';
    }
  };

  const getThemeLabel = () => {
    switch (themeMode) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
      default:
        return 'System';
    }
  };

  const cycleTheme = () => {
    switch (themeMode) {
      case 'system':
        setTheme('light');
        break;
      case 'light':
        setTheme('dark');
        break;
      case 'dark':
        setTheme('system');
        break;
      default:
        setTheme('system');
    }
  };

  return (
    <TouchableOpacity
      style={[glassmorphismStyles.glassButton, styles.container, style]}
      onPress={cycleTheme}
      activeOpacity={0.8}>
      <Icon
        name={getThemeIcon()}
        size={20}
        color={isDarkMode ? '#FFFFFF' : '#000000'}
      />
      <Text style={[glassmorphismStyles.glassText, styles.label]}>
        {getThemeLabel()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 100,
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ThemeToggle;

