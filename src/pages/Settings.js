import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Settings = ({navigation}) => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedDarkMode = await AsyncStorage.getItem('darkMode');
      const savedNotifications = await AsyncStorage.getItem('notifications');
      const savedAutoSync = await AsyncStorage.getItem('autoSync');
      
      if (savedDarkMode !== null) setDarkMode(JSON.parse(savedDarkMode));
      if (savedNotifications !== null) setNotifications(JSON.parse(savedNotifications));
      if (savedAutoSync !== null) setAutoSync(JSON.parse(savedAutoSync));
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveSetting = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log('Error saving setting:', error);
    }
  };

  const handleDarkModeToggle = (value) => {
    setDarkMode(value);
    saveSetting('darkMode', value);
    Alert.alert('Theme Changed', 'App will apply the new theme on next restart.');
  };

  const handleNotificationsToggle = (value) => {
    setNotifications(value);
    saveSetting('notifications', value);
  };

  const handleAutoSyncToggle = (value) => {
    setAutoSync(value);
    saveSetting('autoSync', value);
  };

  const clearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear app cache?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('stockOutData');
              Alert.alert('Success', 'Cache cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            }
          },
        },
      ]
    );
  };

  const SettingItem = ({icon, title, subtitle, rightComponent}) => (
    <View className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-4 border border-gray-700/50 mb-4">
      <View className="flex-row items-center">
        <View className="w-12 h-12 bg-gray-700 rounded-xl items-center justify-center mr-4">
          <Icon name={icon} size={24} color="#9CA3AF" />
        </View>
        <View className="flex-1">
          <Text className="text-white text-lg font-semibold">{title}</Text>
          {subtitle && (
            <Text className="text-gray-400 text-sm mt-1">{subtitle}</Text>
          )}
        </View>
        {rightComponent}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#1f2937" />
      
      <ScrollView className="flex-1 p-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-white text-2xl font-bold">Settings</Text>
          <Text className="text-gray-400 text-sm mt-1">
            Customize your app experience
          </Text>
        </View>

        {/* Appearance Section */}
        <View className="mb-6">
          <Text className="text-white text-lg font-semibold mb-4">Appearance</Text>
          
          <SettingItem
            icon="dark-mode"
            title="Dark Mode"
            subtitle="Use dark theme throughout the app"
            rightComponent={
              <Switch
                value={darkMode}
                onValueChange={handleDarkModeToggle}
                trackColor={{false: '#374151', true: '#3B82F6'}}
                thumbColor={darkMode ? '#ffffff' : '#9CA3AF'}
              />
            }
          />
        </View>

        {/* Notifications Section */}
        <View className="mb-6">
          <Text className="text-white text-lg font-semibold mb-4">Notifications</Text>
          
          <SettingItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Receive alerts and updates"
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={handleNotificationsToggle}
                trackColor={{false: '#374151', true: '#3B82F6'}}
                thumbColor={notifications ? '#ffffff' : '#9CA3AF'}
              />
            }
          />
        </View>

        {/* Data Section */}
        <View className="mb-6">
          <Text className="text-white text-lg font-semibold mb-4">Data & Storage</Text>
          
          <SettingItem
            icon="sync"
            title="Auto Sync"
            subtitle="Automatically sync data when connected"
            rightComponent={
              <Switch
                value={autoSync}
                onValueChange={handleAutoSyncToggle}
                trackColor={{false: '#374151', true: '#3B82F6'}}
                thumbColor={autoSync ? '#ffffff' : '#9CA3AF'}
              />
            }
          />

          <TouchableOpacity onPress={clearCache}>
            <SettingItem
              icon="delete-sweep"
              title="Clear Cache"
              subtitle="Free up storage space"
              rightComponent={
                <Icon name="arrow-forward-ios" size={20} color="#9CA3AF" />
              }
            />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View className="mb-6">
          <Text className="text-white text-lg font-semibold mb-4">Information</Text>
          
          <TouchableOpacity onPress={() => navigation.navigate('About')}>
            <SettingItem
              icon="info"
              title="About App"
              subtitle="Version, developer info, and more"
              rightComponent={
                <Icon name="arrow-forward-ios" size={20} color="#9CA3AF" />
              }
            />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="items-center mt-8 mb-4">
          <Text className="text-gray-500 text-xs">
            WH StockOut Apps v2.0.0
          </Text>
          <Text className="text-gray-500 text-xs mt-1">
            © PED - Denso Indonesia 2025
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

