import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import axios from 'axios';
import {checkUserIDAPI, registerAccountAPI} from '../api';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import {useTheme} from '../context/ThemeContext';

const Register = ({navigation}) => {
  const [npk, setNpk] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const {isDarkMode} = useTheme();

  const handleRegister = async () => {
    if (!npk || !name || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Check if NPK already exists
      const checkResponse = await axios.post(checkUserIDAPI, {NPK: npk});
      
      if (checkResponse.data.exists) {
        Alert.alert('Error', 'NPK already registered');
        setLoading(false);
        return;
      }

      // Register new account
      const registerData = {
        NPK: npk,
        NAME: name,
        PASSWORD: password,
      };

      await axios.post(registerAccountAPI, registerData);
      
      Alert.alert(
        'Success',
        'Account registered successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View className="flex-1 justify-center p-6">
        {/* Header Section */}
        <View className="items-center mb-12">
          <Text className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Create Account
          </Text>
          <Text className="text-lg text-text-secondary-light dark:text-text-secondary-dark mt-2">
            Register for WH StockOut Apps
          </Text>
        </View>

        {/* Form Section */}
        <Card>
          <Input
            placeholder="NPK"
            value={npk}
            onChangeText={setNpk}
            autoCapitalize="none"
          />

          <Input
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Input
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />

          <Input
            placeholder="Confirm Password"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <Button
            title={loading ? "Registering..." : "Register"}
            onPress={handleRegister}
            style="mb-4"
            disabled={loading}
          />

          <Button
            title="Back to Login"
            onPress={() => navigation.navigate('Login')}
            variant="secondary"
          />
        </Card>
      </View>
    </SafeAreaView>
  );
};

export default Register;
