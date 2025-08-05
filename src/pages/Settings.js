import React from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import Card from '../components/Card';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const Settings = ({ navigation }) => {
  const { isDarkMode } = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View className="p-6">
        <Text className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8">Settings</Text>

        <Card style="mb-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg text-text-primary-light dark:text-text-primary-dark">Dark Mode</Text>
            <ThemeToggle />
          </View>
        </Card>

        <TouchableOpacity onPress={() => navigation.navigate('About')}>
          <Card>
            <View className="flex-row justify-between items-center">
              <Text className="text-lg text-text-primary-light dark:text-text-primary-dark">About App</Text>
              <Icon name="info-outline" size={24} className="text-text-secondary-light dark:text-text-secondary-dark" />
            </View>
          </Card>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
