import React, {useRef} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import {glassmorphismStyles} from '../styles/glassmorphism';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AnimatedGlassButton = ({
  title,
  onPress,
  style,
  textStyle,
  icon,
  iconSize = 24,
  variant = 'primary',
  disabled = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

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
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={1}>
      <Animated.View
        style={[
          glassmorphismStyles.glassButton,
          getButtonStyle(),
          disabled && styles.disabledButton,
          {
            transform: [{scale: scaleAnim}],
            opacity: opacityAnim,
          },
          style,
        ]}>
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
      </Animated.View>
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

export default AnimatedGlassButton;

