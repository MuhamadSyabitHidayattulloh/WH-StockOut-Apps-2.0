import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import GlassBackground from '../components/GlassBackground';
import { createGlassmorphismStyles } from '../styles/glassmorphism';
import { useTheme } from '../context/ThemeContext';
import GlassCard from '../components/GlassCard';

const About = () => {
  const { isDarkMode } = useTheme();
  const glassmorphismStyles = createGlassmorphismStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#000000' : '#F5F5F5'}
      />
      <GlassBackground>
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={[glassmorphismStyles.glassTitle, styles.title]}>About</Text>
            
            <GlassCard title="WH StockOut Apps 2.0" icon="inventory" style={styles.infoCard}>
              <Text style={[glassmorphismStyles.glassText, styles.description]}>
                Aplikasi untuk mengelola stok keluar warehouse dengan sistem scan QR code Kanban.
              </Text>
            </GlassCard>

            <GlassCard title="Version" icon="code" style={styles.infoCard}>
              <Text style={[glassmorphismStyles.glassText, styles.description]}>
                Version 2.0.0{'\n'}
                React Native 0.80.2
              </Text>
            </GlassCard>

            <GlassCard title="Developer" icon="person" style={styles.infoCard}>
              <Text style={[glassmorphismStyles.glassText, styles.description]}>
                PED - Denso Indonesia{'\n'}
                2025
              </Text>
            </GlassCard>

            <GlassCard title="Features" icon="star" style={styles.infoCard}>
              <Text style={[glassmorphismStyles.glassText, styles.description]}>
                • QR Code Scanning{'\n'}
                • Kanban Management{'\n'}
                • Stock Out Tracking{'\n'}
                • Dark/Light Mode{'\n'}
                • Modern Glassmorphism UI
              </Text>
            </GlassCard>

            <GlassCard title="Technology Stack" icon="build" style={styles.infoCard}>
              <Text style={[glassmorphismStyles.glassText, styles.description]}>
                • React Native 0.80.2{'\n'}
                • React Navigation{'\n'}
                • AsyncStorage{'\n'}
                • React Native Vision Camera{'\n'}
                • Lottie Animations{'\n'}
                • Vector Icons
              </Text>
            </GlassCard>
          </View>
        </ScrollView>
      </GlassBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default About;

