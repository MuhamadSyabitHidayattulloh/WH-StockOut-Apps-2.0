import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loginApi} from '../api';
import LottieView from 'lottie-react-native';
import SoundPlayer from 'react-native-sound-player';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Login = ({navigation, onLogin}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginAnimation, setLoginAnimation] = useState(false);
  const refUsername = useRef(null);
  const refPassword = useRef(null);

  useEffect(() => {
    checklogin();
  }, []);

  const checklogin = async () => {
    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      const userData = await AsyncStorage.getItem('userDataLogin');
      if (userData) {
        const user = JSON.parse(userData);
        onLogin(user.USERNAME);
      }
    }
  };

  const setAsyncData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = () => {
    // onLogin(username);
    const data = {
      USERNAME: username,
      PASSWORD: password,
    };
    
    if (username && password) {
      axios
        .post(loginApi, data)
        .then(async response => {
          const user = response.data.data;
          await setAsyncData('isLoggedIn', 'true');
          await setAsyncData('userDataLogin', user);
          await showLoginAnimation();
          onLogin(user.USERNAME);
        })
        .catch(error => {
          Alert.alert('Error', 'Username or password incorrect');
          refUsername.current?.clear();
          refPassword.current?.clear();
          refUsername.current?.focus();
        });
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  const playLoginSound = () => {
    try {
      SoundPlayer.playSoundFile('login', 'mp3');
    } catch (error) {
      console.log('Error playing login sound:', error);
    }
  };

  const showLoginAnimation = () => {
    return new Promise((resolve, reject) => {
      try {
        setLoginAnimation(true);
        playLoginSound();
        setTimeout(() => {
          setLoginAnimation(false);
          resolve();
        }, 750);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      
      <View className="flex-1 px-6 py-8">
        {/* Header Section */}
        <View className="flex-1 justify-center items-center">
          <View className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50 items-center">
            <View className="w-16 h-16 bg-blue-600 rounded-full items-center justify-center mb-4">
              <Icon name="inventory" size={32} color="#ffffff" />
            </View>
            <Text className="text-3xl font-bold text-white mb-2">
              WH StockOut Apps
            </Text>
            <Text className="text-gray-400 text-center text-sm">
              Warehouse Management System
            </Text>
          </View>
        </View>

        {/* Form Section */}
        <View className="flex-2 justify-center">
          <View className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 border border-gray-700/50">
            <Text className="text-white text-lg font-semibold text-center mb-6">
              Please login to your account
            </Text>
            
            {/* Username Input */}
            <View className="mb-4">
              <Text className="text-gray-300 text-sm font-medium mb-2">NPK</Text>
              <View className="bg-gray-700/50 rounded-xl border border-gray-600/50 flex-row items-center px-4">
                <Icon name="person" size={20} color="#9CA3AF" />
                <TextInput
                  ref={refUsername}
                  className="flex-1 text-white py-4 px-3"
                  placeholder="Enter your NPK"
                  placeholderTextColor="#9CA3AF"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-gray-300 text-sm font-medium mb-2">Password</Text>
              <View className="bg-gray-700/50 rounded-xl border border-gray-600/50 flex-row items-center px-4">
                <Icon name="lock" size={20} color="#9CA3AF" />
                <TextInput
                  ref={refPassword}
                  className="flex-1 text-white py-4 px-3"
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className="bg-blue-600 rounded-xl py-4 items-center mb-3 flex-row justify-center"
              onPress={handleLogin}
              activeOpacity={0.8}>
              <Icon name="login" size={20} color="#ffffff" />
              <Text className="text-white font-semibold text-lg ml-2">Login</Text>
            </TouchableOpacity>

            {/* Register Button */}
            <TouchableOpacity
              className="bg-gray-700/50 rounded-xl py-4 items-center border border-gray-600/50 flex-row justify-center"
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.8}>
              <Icon name="person-add" size={20} color="#9CA3AF" />
              <Text className="text-gray-300 font-semibold text-lg ml-2">Register</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center pb-4">
          <View className="bg-gray-800/30 rounded-2xl px-4 py-2">
            <Text className="text-gray-400 text-xs">
              © PED - Denso Indonesia 2025
            </Text>
          </View>
        </View>
      </View>

      {/* Login Animation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={loginAnimation}
        onRequestClose={() => setLoginAnimation(false)}>
        <View className="flex-1 bg-black/80 justify-center items-center">
          <LottieView
            source={require('../assets/animations/login.json')}
            autoPlay
            loop
            style={{width: 300, height: 300}}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Login;

