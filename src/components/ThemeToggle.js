import React from 'react';
import {Switch} from 'react-native';
import {useTheme} from '../context/ThemeContext';

const ThemeToggle = () => {
  const {isDarkMode, toggleTheme} = useTheme();

  return <Switch value={isDarkMode} onValueChange={toggleTheme} />;
};

export default ThemeToggle;
