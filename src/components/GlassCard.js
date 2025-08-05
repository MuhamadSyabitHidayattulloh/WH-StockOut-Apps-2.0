import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {glassmorphismStyles} from '../styles/glassmorphism';
import Icon from 'react-native-vector-icons/MaterialIcons';

const GlassCard = ({
  children,
  title,
  subtitle,
  icon,
  iconSize = 24,
  style,
  onPress,
  variant = 'default',
  ...props
}) => {
  const getCardStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryCard;
      case 'secondary':
        return styles.secondaryCard;
      case 'success':
        return styles.successCard;
      case 'warning':
        return styles.warningCard;
      case 'danger':
        return styles.dangerCard;
      default:
        return styles.defaultCard;
    }
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[
        glassmorphismStyles.glassCard,
        getCardStyle(),
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
      {...props}>
      
      {/* Header with icon and title */}
      {(icon || title || subtitle) && (
        <View style={styles.header}>
          {icon && (
            <View style={styles.iconContainer}>
              <Icon
                name={icon}
                size={iconSize}
                color="#FFFFFF"
              />
            </View>
          )}
          
          {(title || subtitle) && (
            <View style={styles.textContainer}>
              {title && (
                <Text style={[glassmorphismStyles.glassText, styles.title]}>
                  {title}
                </Text>
              )}
              {subtitle && (
                <Text style={[glassmorphismStyles.glassSubtitle, styles.subtitle]}>
                  {subtitle}
                </Text>
              )}
            </View>
          )}
          
          {onPress && (
            <Icon
              name="arrow-forward-ios"
              size={16}
              color="rgba(255, 255, 255, 0.6)"
            />
          )}
        </View>
      )}
      
      {/* Content */}
      {children && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  defaultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  primaryCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  secondaryCard: {
    backgroundColor: 'rgba(107, 114, 128, 0.2)',
    borderColor: 'rgba(107, 114, 128, 0.3)',
  },
  successCard: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  warningCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  dangerCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
});

export default GlassCard;

