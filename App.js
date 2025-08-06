import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View, Text, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './src/pages/Login';
import Home from './src/pages/Home';
import Register from './src/pages/Register';
import WOInstruction from './src/pages/WOInstruction';
import FullCameraScan from './src/pages/FullCameraScan';
import Settings from './src/pages/Settings';
import About from './src/pages/About';
import PermissionRequest from './src/pages/PermissionRequest';
import './global.css';

const Stack = createNativeStackNavigator();

const LoadingScreen = () => (
  <View className="flex-1 bg-gray-900 items-center justify-center">
    <View className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50 items-center">
      <View className="w-16 h-16 bg-blue-600 rounded-full items-center justify-center mb-4">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
      <Text className="text-white text-xl font-bold text-center mb-2">
        WH StockOut Apps
      </Text>
      <Text className="text-gray-400 text-center">
        Loading...
      </Text>
    </View>
  </View>
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [permissionsGranted, setPermissionsGranted] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkPermissionsAndLoginStatus();
  }, []);

  const checkPermissionsAndLoginStatus = async () => {
    try {
      // Check if permissions have been granted
      const permissionsStatus = await AsyncStorage.getItem('permissionsGranted');
      setPermissionsGranted(permissionsStatus === 'true');

      // Check if user is already logged in
      const isLoggedInStatus = await AsyncStorage.getItem('isLoggedIn');
      if (isLoggedInStatus === 'true') {
        const userData = await AsyncStorage.getItem('userDataLogin');
        if (userData) {
          const user = JSON.parse(userData);
          setUsername(user.USERNAME);
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.log('Error checking permissions and login status:', error);
      setPermissionsGranted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('isLoggedIn');
      await AsyncStorage.removeItem('userDataLogin');
      setUsername('');
      setIsLoggedIn(false);
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1f2937',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#ffffff',
          },
        }}>
        {!permissionsGranted ? (
          // Permission Request Screen
          <Stack.Screen
            name="PermissionRequest"
            component={PermissionRequest}
            options={{headerShown: false}}
          />
        ) : !isLoggedIn ? (
          // Login/Register Screens
          <>
            <Stack.Screen
              name="Login"
              options={{headerShown: false}}>
              {props => <Login {...props} onLogin={handleLogin} />}
            </Stack.Screen>
            <Stack.Screen
              name="Register"
              component={Register}
              options={{
                title: 'Create Account',
              }}
            />
            <Stack.Screen
              name="Full Camera Scan"
              component={FullCameraScan}
              options={{
                headerShown: false,
              }}
            />
          </>
        ) : (
          // Main App Screens
          <>
            <Stack.Screen
              name="Home"
              options={{
                title: 'WH StockOut Apps',
                headerLeft: () => null,
              }}>
              {props => <Home {...props} onLogout={handleLogout} />}
            </Stack.Screen>
            <Stack.Screen
              name="WOInstruction"
              component={WOInstruction}
              options={{
                title: 'Stock Out Part WH',
              }}
            />
            <Stack.Screen
              name="Settings"
              component={Settings}
              options={{
                title: 'Settings',
              }}
            />
            <Stack.Screen
              name="About"
              component={About}
              options={{
                title: 'About',
              }}
            />
            <Stack.Screen
              name="Full Camera Scan"
              component={FullCameraScan}
              options={{
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

