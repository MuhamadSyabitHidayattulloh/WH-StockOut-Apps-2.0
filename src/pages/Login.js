import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
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
import GlassBackground from '../components/GlassBackground';
import GlassInput from '../components/GlassInput';
import AnimatedGlassButton from '../components/AnimatedGlassButton';
import {glassmorphismStyles} from '../styles/glassmorphism';

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
      require('../assets/sounds/login.mp3'),
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <GlassBackground>
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={[glassmorphismStyles.glassContainer, styles.titleContainer]}>
              <Text style={glassmorphismStyles.glassTitle}>
                WH StockOut Apps
              </Text>
              <Text style={[glassmorphismStyles.glassSubtitle, styles.subtitle]}>
                Warehouse Management System
              </Text>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={[glassmorphismStyles.glassCard, styles.formCard]}>
              <Text style={[glassmorphismStyles.glassText, styles.formTitle]}>
                Please login to your account
              </Text>
              
              <GlassInput
                placeholder="NPK"
                value={username}
                inputRef={refUsername}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              
              <GlassInput
                placeholder="PASSWORD"
                secureTextEntry={true}
                value={password}
                inputRef={refPassword}
                onChangeText={setPassword}
              />
              
              <AnimatedGlassButton
                title="Login"
                onPress={handleLogin}
                icon="login"
                style={styles.loginButton}
              />
              
              <AnimatedGlassButton
                title="Register"
                onPress={() => navigation.navigate('Register')}
                variant="secondary"
                icon="person-add"
                style={styles.registerButton}
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

      {/* Login Animation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={loginAnimation}
        onRequestClose={() => setLoginAnimation(false)}>
        <View style={glassmorphismStyles.glassModal}>
          <LottieView
            source={require('../assets/animations/login.json')}
            autoPlay
            loop
            style={styles.animationStyle}
          />
        </View>
      </Modal>
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
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 12,
  },
  registerButton: {
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
  animationStyle: {
    width: 300,
    height: 300,
  },
});

export default Login;

