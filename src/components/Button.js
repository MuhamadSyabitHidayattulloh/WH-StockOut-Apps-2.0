import React from 'react';
import {TouchableOpacity, Text} from 'react-native';

const Button = ({title, onPress, variant = 'primary', style, disabled}) => {
  const baseButtonClass = 'rounded-lg py-3';
  const baseTextClass = 'text-center font-bold text-lg';

  const buttonClasses = {
    primary: 'bg-primary-light dark:bg-primary-dark',
    secondary: 'bg-secondary-light dark:bg-secondary-dark',
    success: 'bg-green-500',
    danger: 'bg-red-500',
  };

  const textClasses = {
    primary: 'text-white dark:text-black',
    secondary: 'text-primary-light dark:text-primary-dark',
    success: 'text-white',
    danger: 'text-white',
  };

  return (
    <TouchableOpacity
      className={`${baseButtonClass} ${buttonClasses[variant]} ${style}`}
      onPress={onPress}
      disabled={disabled}>
      <Text className={`${baseTextClass} ${textClasses[variant]}`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
