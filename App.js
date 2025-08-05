import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ThemeProvider, useTheme} from './src/context/ThemeContext';
import Login from './src/pages/Login';
import Home from './src/pages/Home';
import Register from './src/pages/Register';
import WOInstruction from './src/pages/WOInstruction';
import FullCameraScan from './src/pages/FullCameraScan';
import Settings from './src/pages/Settings';
import About from './src/pages/About';
import { View } from 'react-native';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const {isDarkMode} = useTheme();

  const handleLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUsername('');
    setIsLoggedIn(false);
  };

  return (
    <View className={isDarkMode ? 'dark' : 'light'} style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator>
          {!isLoggedIn ? (
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
            </>
          ) : (
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
    </View>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
