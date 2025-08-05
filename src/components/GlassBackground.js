import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {createGlassmorphismStyles} from '../styles/glassmorphism';
import {useTheme} from '../context/ThemeContext';

const {width, height} = Dimensions.get('window');

const GlassBackground = ({children, style}) => {
  const {isDarkMode} = useTheme();
  const glassmorphismStyles = createGlassmorphismStyles(isDarkMode);

  return (
    <View style={[styles.container, glassmorphismStyles.backgroundGradient, style]}>
      {/* Floating glass elements for background effect */}
      <View style={[styles.floatingGlass, styles.glass1, {
        backgroundColor: isDarkMode 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(0, 0, 0, 0.05)',
        borderColor: isDarkMode 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(0, 0, 0, 0.1)',
      }]} />
      <View style={[styles.floatingGlass, styles.glass2, {
        backgroundColor: isDarkMode 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(0, 0, 0, 0.05)',
        borderColor: isDarkMode 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(0, 0, 0, 0.1)',
      }]} />
      <View style={[styles.floatingGlass, styles.glass3, {
        backgroundColor: isDarkMode 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(0, 0, 0, 0.05)',
        borderColor: isDarkMode 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(0, 0, 0, 0.1)',
      }]} />
      <View style={[styles.floatingGlass, styles.glass4, {
        backgroundColor: isDarkMode 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(0, 0, 0, 0.05)',
        borderColor: isDarkMode 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(0, 0, 0, 0.1)',
      }]} />
      
      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
  floatingGlass: {
    position: 'absolute',
    borderRadius: 100,
    borderWidth: 1,
  },
  glass1: {
    width: 200,
    height: 200,
    top: -100,
    left: -50,
  },
  glass2: {
    width: 150,
    height: 150,
    top: height * 0.2,
    right: -75,
  },
  glass3: {
    width: 120,
    height: 120,
    bottom: height * 0.3,
    left: -60,
  },
  glass4: {
    width: 180,
    height: 180,
    bottom: -90,
    right: -90,
  },
});

export default GlassBackground;

