import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {glassmorphismStyles} from '../styles/glassmorphism';

const {width, height} = Dimensions.get('window');

const GlassBackground = ({children, style}) => {
  return (
    <View style={[styles.container, glassmorphismStyles.backgroundGradient, style]}>
      {/* Floating glass elements for background effect */}
      <View style={[styles.floatingGlass, styles.glass1]} />
      <View style={[styles.floatingGlass, styles.glass2]} />
      <View style={[styles.floatingGlass, styles.glass3]} />
      <View style={[styles.floatingGlass, styles.glass4]} />
      
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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

