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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loginApi, loginQrApi} from '../api';
import LottieView from 'lottie-react-native';
import SoundPlayer from 'react-native-sound-player';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {validateNPK, validatePassword, handleApiError} from '../function/General';

const Login = ({navigation, onLogin}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginAnimation, setLoginAnimation] = useState(false);
  const [showQrLogin, setShowQrLogin] = useState(false);
  const [qrCode, setQrCode] = useState('');
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
    onLogin(username);
    const data = {
      USERNAME: username,
      PASSWORD: password,
    };
    
    if (username && password) {
      // Validate username format
      const usernameValidation = validateNPK(username);
      if (!usernameValidation.isValid) {
        Alert.alert('Error', usernameValidation.message);
        return;
      }

      // Validate password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        Alert.alert('Error', passwordValidation.message);
        return;
      }

      axios
        .post(loginApi, data)
        .then(async response => {
          if (response.data.msg === "get data success login") {
            const user = response.data.data;
            await setAsyncData('isLoggedIn', 'true');
            await setAsyncData('userDataLogin', user);
            await showLoginAnimation();
            onLogin(user.USERNAME);
          } else {
            Alert.alert('Error', 'Login failed. Please try again.');
          }
        })
        .catch(error => {
          const errorInfo = handleApiError(error);
          Alert.alert('Error', errorInfo.message);
          refUsername.current?.clear();
          refPassword.current?.clear();
          refUsername.current?.focus();
        });
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  const handleQrLogin = () => {
    if (!qrCode) {
      Alert.alert('Error', 'Please scan QR code');
      return;
    }

    const data = {
      USERNAME: qrCode,
      PASSWORD: qrCode, // QR code acts as both username and password
    };

    axios
      .post(loginQrApi, data)
      .then(async response => {
        if (response.data.msg === "get data success login") {
          const user = response.data.data;
          await setAsyncData('isLoggedIn', 'true');
          await setAsyncData('userDataLogin', {
            USERID: user.username,
            plant_code: user.plant_code,
            USERNAME: user.name,
            token: user.token,
          });
          await showLoginAnimation();
          onLogin(user.name);
          setShowQrLogin(false);
          setQrCode('');
        } else {
          Alert.alert('Error', 'QR Login failed. Please try again.');
        }
      })
      .catch(error => {
        const errorInfo = handleApiError(error);
        Alert.alert('Error', errorInfo.message);
        setQrCode('');
      });
  };

  const playLoginSound = () => {
    try {
      SoundPlayer.playSoundFile('login', 'mp3');
    } catch (error) {
      console.log('Error playing login sound:', error);
    }
  };

  // Memoized InputField component
  const InputField = React.useCallback(({icon, placeholder, value, onChangeText, secureTextEntry = false, inputRef, onSubmitEditing, keyboardType = 'default', autoComplete = 'off'}) => (
    <View className="mb-4">
      <View className="bg-gray-700/50 rounded-xl border border-gray-600/50 flex-row items-center px-4">
        <Icon name={icon} size={20} color="#9CA3AF" />
        <TextInput
          ref={inputRef}
          className="flex-1 text-white py-4 px-3"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          autoCapitalize={secureTextEntry ? 'none' : 'words'}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          autoCorrect={false}
          spellCheck={false}
          blurOnSubmit={false}
          returnKeyType="next"
          enablesReturnKeyAutomatically={true}
          onSubmitEditing={onSubmitEditing}
          contextMenuHidden={true}
          selectTextOnFocus={false}
          caretHidden={false}
        />
      </View>
    </View>
  ), []);

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
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
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
              <InputField
                icon="person"
                placeholder="Enter your NPK"
                value={username}
                onChangeText={setUsername}
                inputRef={refUsername}
                keyboardType="default"
                autoComplete="username"
                onSubmitEditing={() => refPassword.current?.focus()}
              />
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-gray-300 text-sm font-medium mb-2">Password</Text>
              <InputField
                icon="lock"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                inputRef={refPassword}
                keyboardType="default"
                autoComplete="password"
                onSubmitEditing={handleLogin}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className="bg-blue-600 rounded-xl py-4 items-center mb-3 flex-row justify-center"
              onPress={handleLogin}
              activeOpacity={0.8}>
              <Icon name="login" size={20} color="#ffffff" />
              <Text className="text-white font-semibold text-lg ml-2">Login</Text>
            </TouchableOpacity>

            {/* QR Login Button */}
            <TouchableOpacity
              className="bg-green-600/20 rounded-xl py-4 items-center border border-green-500/30 flex-row justify-center mb-3"
              onPress={() => setShowQrLogin(true)}
              activeOpacity={0.8}>
              <Icon name="qr-code-scanner" size={20} color="#10B981" />
              <Text className="text-green-400 font-semibold text-lg ml-2">Login with QR Code</Text>
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

      {/* QR Login Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showQrLogin}
        onRequestClose={() => setShowQrLogin(false)}>
        <View className="flex-1 bg-black/80 justify-center items-center">
          <View className="bg-gray-800/90 backdrop-blur-lg rounded-3xl p-6 border border-gray-700/50 w-11/12 max-w-md">
            <View className="items-center mb-6">
              <View className="w-16 h-16 bg-green-600 rounded-full items-center justify-center mb-4">
                <Icon name="qr-code-scanner" size={32} color="#ffffff" />
              </View>
              <Text className="text-2xl font-bold text-white mb-2">
                QR Code Login
              </Text>
              <Text className="text-gray-400 text-center">
                Scan your QR code to login quickly
              </Text>
            </View>

            {/* QR Code Input */}
            <View className="mb-6">
              <Text className="text-gray-300 text-sm font-medium mb-2">QR Code</Text>
              <InputField
                icon="qr-code"
                placeholder="Enter or scan QR code"
                value={qrCode}
                onChangeText={setQrCode}
                keyboardType="default"
                autoComplete="off"
                onSubmitEditing={handleQrLogin}
              />
              
              {/* Scan QR Button */}
              <TouchableOpacity
                className="bg-blue-600 rounded-xl py-3 flex-row items-center justify-center mt-3"
                onPress={() => {
                  setShowQrLogin(false);
                  navigation.navigate('Full Camera Scan', {
                    scanRead: (scannedData) => {
                      setQrCode(scannedData);
                      setShowQrLogin(true);
                    },
                  });
                }}
                activeOpacity={0.8}>
                <Icon name="camera-alt" size={20} color="#ffffff" />
                <Text className="text-white font-semibold text-lg ml-2">
                  Scan QR Code
                </Text>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1 bg-green-600 rounded-xl py-4 items-center"
                onPress={handleQrLogin}
                activeOpacity={0.8}>
                <Text className="text-white font-semibold text-lg">Login</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="flex-1 bg-gray-600 rounded-xl py-4 items-center"
                onPress={() => {
                  setShowQrLogin(false);
                  setQrCode('');
                }}
                activeOpacity={0.8}>
                <Text className="text-white font-semibold text-lg">Cancel</Text>
              </TouchableOpacity>
            </View>

            {/* Manual Entry Note */}
            <View className="mt-4 p-3 bg-blue-600/20 rounded-xl border border-blue-500/30">
              <Text className="text-blue-400 text-xs text-center">
                💡 You can manually enter your QR code or use the scanner
              </Text>
            </View>
          </View>
        </View>
      </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

