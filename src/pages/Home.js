import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Card from '../components/Card';
import {useTheme} from '../context/ThemeContext';

const Home = ({navigation, onLogout}) => {
  const [username, setUsername] = useState('');
  const {isDarkMode} = useTheme();

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
        backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
      },
      headerTintColor: isDarkMode ? '#FFFFFF' : '#111827',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: isDarkMode ? '#FFFFFF' : '#111827',
      },
      headerRight: () => (
        <TouchableOpacity
          onPress={handleLogout}
          className="mr-4 p-2 rounded-lg bg-red-100 dark:bg-red-900">
          <Icon name="logout" size={24} color="#EF4444" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isDarkMode]);

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
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View className="p-6">
        {/* Welcome Section */}
        <Card style="mb-6 items-center">
          <Text className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Welcome Back
          </Text>
          <Text className="text-xl text-text-secondary-light dark:text-text-secondary-dark mt-2">
            {username}
          </Text>
        </Card>

        {/* Menu Section */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Quick Actions
          </Text>

          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate(item.navigateTo)}
              className="bg-card-light dark:bg-card-dark rounded-2xl p-4 mb-4 flex-row items-center shadow-md">
                <View className="w-14 h-14 rounded-full bg-primary-light dark:bg-primary-dark justify-center items-center mr-4">
                  <Icon name={item.icon} size={30} color={isDarkMode ? '#000000' : '#FFFFFF'} />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">{item.title}</Text>
                  <Text className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{item.subtitle}</Text>
                </View>
                <Icon name="chevron-right" size={24} className="text-text-secondary-light dark:text-text-secondary-dark" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Section */}
        <Card>
          <Text className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4 text-center">
            System Status
          </Text>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Icon name="check-circle" size={24} color="#34D399" />
              <Text className="text-text-secondary-light dark:text-text-secondary-dark mt-1">Online</Text>
            </View>
            <View className="items-center">
              <Icon name="sync" size={24} color="#60A5FA" />
              <Text className="text-text-secondary-light dark:text-text-secondary-dark mt-1">Synced</Text>
            </View>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
};

export default Home;
