import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {glassmorphismStyles} from '../styles/glassmorphism';
import Icon from 'react-native-vector-icons/MaterialIcons';

const GlassButton = ({
  title,
  onPress,
  style,
  textStyle,
  icon,
  iconSize = 24,
  variant = 'primary',
  disabled = false,
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'danger':
        return styles.dangerButton;
      case 'success':
        return styles.successButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'danger':
        return styles.dangerText;
      case 'success':
        return styles.successText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        glassmorphismStyles.glassButton,
        getButtonStyle(),
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}>
      {icon && (
        <Icon
          name={icon}
          size={iconSize}
          color={disabled ? 'rgba(255, 255, 255, 0.3)' : '#FFFFFF'}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          glassmorphismStyles.glassText,
          getTextStyle(),
          disabled && styles.disabledText,
          textStyle,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },
  secondaryButton: {
    backgroundColor: 'rgba(107, 114, 128, 0.3)',
    borderColor: 'rgba(107, 114, 128, 0.5)',
  },
  dangerButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  successButton: {
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
    borderColor: 'rgba(34, 197, 94, 0.5)',
  },
  disabledButton: {
    backgroundColor: 'rgba(107, 114, 128, 0.2)',
    borderColor: 'rgba(107, 114, 128, 0.3)',
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  secondaryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dangerText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  successText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  disabledText: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  icon: {
    marginRight: 8,
  },
});

export default GlassButton;

