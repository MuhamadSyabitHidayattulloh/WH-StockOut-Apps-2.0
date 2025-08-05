import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import axios from 'axios';
import {checkUserIDAPI, registerAccountAPI} from '../api';
import GlassBackground from '../components/GlassBackground';
import GlassInput from '../components/GlassInput';
import AnimatedGlassButton from '../components/AnimatedGlassButton';
import {glassmorphismStyles} from '../styles/glassmorphism';

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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <GlassBackground>
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={[glassmorphismStyles.glassContainer, styles.titleContainer]}>
              <Text style={glassmorphismStyles.glassTitle}>
                Create Account
              </Text>
              <Text style={[glassmorphismStyles.glassSubtitle, styles.subtitle]}>
                Register for WH StockOut Apps
              </Text>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={[glassmorphismStyles.glassCard, styles.formCard]}>
              <GlassInput
                placeholder="NPK"
                value={npk}
                onChangeText={setNpk}
                autoCapitalize="none"
              />
              
              <GlassInput
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              
              <GlassInput
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
              
              <GlassInput
                placeholder="Confirm Password"
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              
              <AnimatedGlassButton
                title={loading ? "Registering..." : "Register"}
                onPress={handleRegister}
                icon="person-add"
                style={styles.registerButton}
                disabled={loading}
              />
              
              <AnimatedGlassButton
                title="Back to Login"
                onPress={() => navigation.navigate('Login')}
                variant="secondary"
                icon="arrow-back"
                style={styles.backButton}
              />
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footerSection}>
            <View style={[glassmorphismStyles.glassContainer, styles.footerContainer]}>
              <Text style={[glassmorphismStyles.glassSubtitle, styles.footerText]}>
                © PED - Denso Indonesia 2025
              </Text>
            </View>
          </View>
        </View>
      </GlassBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  headerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  titleContainer: {
    padding: 24,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
  },
  formSection: {
    flex: 2,
    justifyContent: 'center',
  },
  formCard: {
    padding: 24,
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 12,
  },
  backButton: {
    marginTop: 4,
  },
  footerSection: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  footerText: {
    fontSize: 12,
  },
});

export default Register;

