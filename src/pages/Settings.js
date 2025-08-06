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
import {useTheme} from '../context/ThemeContext';

const Settings = ({navigation}) => {
  const {isDarkMode, toggleTheme, colors} = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedNotifications = await AsyncStorage.getItem('notifications');
      const savedAutoSync = await AsyncStorage.getItem('autoSync');
      
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
    toggleTheme();
    Alert.alert('Theme Changed', 'Theme has been updated successfully!');
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
    <View style={{backgroundColor: colors.card}} className="backdrop-blur-lg rounded-2xl p-4 border border-gray-700/50 mb-4">
      <View className="flex-row items-center">
        <View style={{backgroundColor: colors.surface}} className="w-12 h-12 rounded-xl items-center justify-center mr-4">
          <Icon name={icon} size={24} color={colors.textSecondary} />
        </View>
        <View className="flex-1">
          <Text style={{color: colors.text}} className="text-lg font-semibold">{title}</Text>
          {subtitle && (
            <Text style={{color: colors.textSecondary}} className="text-sm mt-1">{subtitle}</Text>
          )}
        </View>
        {rightComponent}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.primary}}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.primary} />
      
      <ScrollView className="flex-1 p-6">
        {/* Header */}
        <View className="mb-8">
          <Text style={{color: colors.text}} className="text-2xl font-bold">Settings</Text>
          <Text style={{color: colors.textSecondary}} className="text-sm mt-1">
            Customize your app experience
          </Text>
        </View>

        {/* Appearance Section */}
        <View className="mb-6">
          <Text style={{color: colors.text}} className="text-lg font-semibold mb-4">Appearance</Text>
          
          <SettingItem
            icon="dark-mode"
            title="Dark Mode"
            subtitle="Use dark theme throughout the app"
            rightComponent={
              <Switch
                value={isDarkMode}
                onValueChange={handleDarkModeToggle}
                trackColor={{false: colors.surface, true: colors.accent}}
                thumbColor={isDarkMode ? '#ffffff' : colors.textSecondary}
              />
            }
          />
        </View>

        {/* Notifications Section */}
        <View className="mb-6">
          <Text style={{color: colors.text}} className="text-lg font-semibold mb-4">Notifications</Text>
          
          <SettingItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Receive alerts and updates"
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={handleNotificationsToggle}
                trackColor={{false: colors.surface, true: colors.accent}}
                thumbColor={notifications ? '#ffffff' : colors.textSecondary}
              />
            }
          />
        </View>

        {/* Data Section */}
        <View className="mb-6">
          <Text style={{color: colors.text}} className="text-lg font-semibold mb-4">Data & Storage</Text>
          
          <SettingItem
            icon="sync"
            title="Auto Sync"
            subtitle="Automatically sync data when connected"
            rightComponent={
              <Switch
                value={autoSync}
                onValueChange={handleAutoSyncToggle}
                trackColor={{false: colors.surface, true: colors.accent}}
                thumbColor={autoSync ? '#ffffff' : colors.textSecondary}
              />
            }
          />

          <TouchableOpacity onPress={clearCache}>
            <SettingItem
              icon="delete-sweep"
              title="Clear Cache"
              subtitle="Free up storage space"
              rightComponent={
                <Icon name="arrow-forward-ios" size={20} color={colors.textSecondary} />
              }
            />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View className="mb-6">
          <Text style={{color: colors.text}} className="text-lg font-semibold mb-4">Information</Text>
          
          <TouchableOpacity onPress={() => navigation.navigate('About')}>
            <SettingItem
              icon="info"
              title="About App"
              subtitle="Version, developer info, and more"
              rightComponent={
                <Icon name="arrow-forward-ios" size={20} color={colors.textSecondary} />
              }
            />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="items-center mt-8 mb-4">
          <Text style={{color: colors.textMuted}} className="text-xs">
            WH StockOut Apps v2.0.0
          </Text>
          <Text style={{color: colors.textMuted}} className="text-xs mt-1">
            © PED - Denso Indonesia 2025
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

