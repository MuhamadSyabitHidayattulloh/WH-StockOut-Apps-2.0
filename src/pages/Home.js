import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
      headerRight: () => (
        <TouchableOpacity
          onPress={handleLogout}
          className="mr-4 p-2 bg-red-600/20 rounded-lg">
          <Icon name="logout" size={24} color="#ffffff" />
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
      color: 'bg-blue-600',
    },
    {
      title: 'Settings',
      subtitle: 'App preferences and configuration',
      icon: 'settings',
      navigateTo: 'Settings',
      color: 'bg-gray-600',
    },
    {
      title: 'About',
      subtitle: 'App information and version details',
      icon: 'info',
      navigateTo: 'About',
      color: 'bg-green-600',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#1f2937" />
      
      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Welcome Section */}
          <View className="mb-8">
            <View className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 border border-gray-700/50">
              <View className="items-center">
                <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-4">
                  <Icon name="person" size={40} color="#ffffff" />
                </View>
                <Text className="text-2xl font-bold text-white mb-2">
                  Welcome Back
                </Text>
                <Text className="text-blue-400 text-lg font-semibold">
                  {username}
                </Text>
              </View>
            </View>
          </View>

          {/* Menu Section */}
          <View className="mb-6">
            <Text className="text-white text-xl font-bold mb-4">
              Quick Actions
            </Text>
            
            <View className="space-y-4">
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-4 border border-gray-700/50"
                  onPress={() => navigation.navigate(item.navigateTo)}
                  activeOpacity={0.8}>
                  <View className="flex-row items-center">
                    <View className={`w-14 h-14 ${item.color} rounded-xl items-center justify-center mr-4`}>
                      <Icon name={item.icon} size={28} color="#ffffff" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white text-lg font-semibold mb-1">
                        {item.title}
                      </Text>
                      <Text className="text-gray-400 text-sm">
                        {item.subtitle}
                      </Text>
                    </View>
                    <Icon name="arrow-forward-ios" size={20} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stats Section */}
          <View className="mb-6">
            <View className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <Text className="text-white text-lg font-semibold text-center mb-4">
                System Status
              </Text>
              <View className="flex-row justify-around">
                <View className="items-center">
                  <View className="w-12 h-12 bg-green-600 rounded-full items-center justify-center mb-2">
                    <Icon name="check-circle" size={24} color="#ffffff" />
                  </View>
                  <Text className="text-gray-300 text-sm">Online</Text>
                </View>
                <View className="items-center">
                  <View className="w-12 h-12 bg-blue-600 rounded-full items-center justify-center mb-2">
                    <Icon name="sync" size={24} color="#ffffff" />
                  </View>
                  <Text className="text-gray-300 text-sm">Synced</Text>
                </View>
                <View className="items-center">
                  <View className="w-12 h-12 bg-purple-600 rounded-full items-center justify-center mb-2">
                    <Icon name="security" size={24} color="#ffffff" />
                  </View>
                  <Text className="text-gray-300 text-sm">Secure</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

