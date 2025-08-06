import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import {checkUserIDAPI, registerAccountAPI} from '../api';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Register = ({navigation}) => {
  const [npk, setNpk] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!npk || !name || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 4) {
      Alert.alert('Error', 'Password must be at least 4 characters');
      return;
    }

    setLoading(true);
    try {
      // Check if NPK already exists
      const checkResponse = await axios.post(checkUserIDAPI, {
        NPK: npk,
      });

      if (checkResponse.data.success) {
        Alert.alert('Error', 'NPK already registered');
        setLoading(false);
        return;
      }

      // Register new account
      const registerResponse = await axios.post(registerAccountAPI, {
        NPK: npk,
        NAME: name,
        PASSWORD: password,
      });

      if (registerResponse.data.success) {
        Alert.alert(
          'Success',
          'Account created successfully! Please login with your credentials.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({icon, placeholder, value, onChangeText, secureTextEntry = false}) => (
    <View className="mb-4">
      <View className="bg-gray-700/50 rounded-xl border border-gray-600/50 flex-row items-center px-4">
        <Icon name={icon} size={20} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-white py-4 px-3"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          autoCapitalize={secureTextEntry ? 'none' : 'words'}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#1f2937" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          {/* Header */}
          <View className="items-center mb-8 mt-4">
            <View className="w-20 h-20 bg-green-600 rounded-full items-center justify-center mb-4">
              <Icon name="person-add" size={40} color="#ffffff" />
            </View>
            <Text className="text-3xl font-bold text-white mb-2">
              Create Account
            </Text>
            <Text className="text-gray-400 text-center">
              Join WH StockOut Management System
            </Text>
          </View>

          {/* Registration Form */}
          <View className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 border border-gray-700/50 mb-6">
            <Text className="text-white text-lg font-semibold text-center mb-6">
              Fill in your information
            </Text>
            
            <InputField
              icon="person"
              placeholder="NPK (Employee ID)"
              value={npk}
              onChangeText={setNpk}
            />
            
            <InputField
              icon="badge"
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />
            
            <InputField
              icon="lock"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            <InputField
              icon="lock-outline"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            {/* Register Button */}
            <TouchableOpacity
              className={`bg-green-600 rounded-xl py-4 items-center mb-4 flex-row justify-center ${
                loading ? 'opacity-50' : ''
              }`}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}>
              <Icon name="person-add" size={20} color="#ffffff" />
              <Text className="text-white font-semibold text-lg ml-2">
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Terms */}
            <Text className="text-gray-400 text-xs text-center mb-4">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>

          {/* Login Link */}
          <View className="flex-row justify-center">
            <Text className="text-gray-400">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-green-400 font-medium">Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="items-center mt-8 mb-4">
            <Text className="text-gray-500 text-xs">
              © PED - Denso Indonesia 2025
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;

