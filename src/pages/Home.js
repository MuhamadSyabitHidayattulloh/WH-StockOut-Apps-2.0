import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GlassBackground from '../components/GlassBackground';
import {glassmorphismStyles} from '../styles/glassmorphism';

const Home = ({navigation, onLogout}) => {
  const [username, setUsername] = useState('');

  useFocusEffect(
    useCallback(() => {
      const getUserFromAsyncStorage = async () => {
        const value = await AsyncStorage.getItem('userDataLogin');
        if (value !== null) {
          setUsername(JSON.parse(value).USERNAME);
        }
      };
      getUserFromAsyncStorage();
    }, []),
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('userDataLogin');
    onLogout();
  };

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#000000',
      },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: '#FFFFFF',
      },
      headerRight: () => (
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}>
          <Icon name="logout" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const menuItems = [
    {
      title: 'Stock Out Part WH',
      subtitle: 'Manage warehouse stock out operations',
      icon: 'inventory',
      navigateTo: 'WOInstruction',
    },
    {
      title: 'Settings',
      subtitle: 'App preferences and theme',
      icon: 'settings',
      navigateTo: 'Settings',
    },
    {
      title: 'About',
      subtitle: 'App information and version',
      icon: 'info',
      navigateTo: 'About',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <GlassBackground>
        <View style={styles.content}>
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <View style={[glassmorphismStyles.glassCard, styles.welcomeCard]}>
              <Text style={[glassmorphismStyles.glassTitle, styles.welcomeTitle]}>
                Welcome Back
              </Text>
              <Text style={[glassmorphismStyles.glassSubtitle, styles.welcomeSubtitle]}>
                {username}
              </Text>
            </View>
          </View>

          {/* Menu Section */}
          <View style={styles.menuSection}>
            <Text style={[glassmorphismStyles.glassText, styles.sectionTitle]}>
              Quick Actions
            </Text>
            
            {menuItems.map((item, index) => (
              <GlassCard
                key={index}
                title={item.title}
                subtitle={item.subtitle}
                icon={item.icon}
                onPress={() => navigation.navigate(item.navigateTo)}
                style={styles.menuItem}
              />
            ))}
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <View style={[glassmorphismStyles.glassCard, styles.statsCard]}>
              <Text style={[glassmorphismStyles.glassText, styles.statsTitle]}>
                System Status
              </Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Icon name="check-circle" size={24} color="#34D399" />
                  <Text style={[glassmorphismStyles.glassSubtitle, styles.statText]}>
                    Online
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="sync" size={24} color="#60A5FA" />
                  <Text style={[glassmorphismStyles.glassSubtitle, styles.statText]}>
                    Synced
                  </Text>
                </View>
              </View>
            </View>
          </View>
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
  logoutButton: {
    marginRight: 15,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeCard: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  menuSection: {
    flex: 1,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  menuItem: {
    padding: 20,
    marginBottom: 12,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
  },
  statsSection: {
    marginBottom: 20,
  },
  statsCard: {
    padding: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statText: {
    marginTop: 4,
    fontSize: 12,
  },
});

export default Home;

