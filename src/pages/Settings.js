import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import GlassBackground from '../components/GlassBackground';
import { createGlassmorphismStyles } from '../styles/glassmorphism';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import GlassCard from '../components/GlassCard';

const Settings = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const glassmorphismStyles = createGlassmorphismStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#000000' : '#F5F5F5'}
      />
      <GlassBackground>
        <View style={styles.content}>
          <Text style={[glassmorphismStyles.glassTitle, styles.title]}>Settings</Text>
          <GlassCard title="Theme" style={styles.settingCard}>
            <View style={styles.settingItem}>
              <Text style={[glassmorphismStyles.glassText, styles.settingText]}>Dark Mode</Text>
              <ThemeToggle />
            </View>
          </GlassCard>
          <GlassCard
            title="About App"
            icon="info-outline"
            onPress={() => navigation.navigate('About')}
            style={styles.settingCard}
          />
        </View>
      </GlassBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
  },
  settingCard: {
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingText: {
    fontSize: 16,
  },
});

export default Settings;

