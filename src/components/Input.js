import React from 'react';
import {TextInput} from 'react-native';
import {useTheme} from '../context/ThemeContext';

const Input = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  inputRef,
  autoCapitalize,
}) => {
  const {isDarkMode} = useTheme();

  return (
    <TextInput
      ref={inputRef}
      className="bg-secondary-light dark:bg-secondary-dark text-text-primary-light dark:text-text-primary-dark rounded-lg px-4 py-3 mb-4 border border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark"
      placeholder={placeholder}
      placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
    />
  );
};

export default Input;
