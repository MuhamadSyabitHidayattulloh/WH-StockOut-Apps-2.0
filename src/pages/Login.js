import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Modal,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loginApi} from '../api';
import LottieView from 'lottie-react-native';
import Sound from 'react-native-sound';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import {useTheme} from '../context/ThemeContext';

const Login = ({navigation, onLogin}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginAnimation, setLoginAnimation] = useState(false);
  const refUsername = useRef(null);
  const refPassword = useRef(null);
  const {isDarkMode} = useTheme();

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
    const loginSound = new Sound(
      require('../sounds/login.mp3'),
      error => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        loginSound.play();
      },
    );
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
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View className="flex-1 justify-center p-6">
        {/* Header Section */}
        <View className="items-center mb-12">
          <Text className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">
            WH StockOut Apps
          </Text>
          <Text className="text-lg text-text-secondary-light dark:text-text-secondary-dark mt-2">
            Warehouse Management System
          </Text>
        </View>

        {/* Form Section */}
        <Card>
          <Text className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark text-center mb-6">
            Please login to your account
          </Text>

          <Input
            inputRef={refUsername}
            placeholder="NPK"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Input
            inputRef={refPassword}
            placeholder="PASSWORD"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />

          <Button
            title="Login"
            onPress={handleLogin}
            style="mb-4"
          />

          <Button
            title="Register"
            onPress={() => navigation.navigate('Register')}
            variant="secondary"
          />
        </Card>

        {/* Footer */}
        <View className="items-center mt-12">
          <Text className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
            © PED - Denso Indonesia 2025
          </Text>
        </View>
      </View>

      {/* Login Animation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={loginAnimation}
        onRequestClose={() => setLoginAnimation(false)}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <LottieView
            source={require('../animations/login.json')}
            autoPlay
            loop
            style={{width: 200, height: 200}}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Login;
