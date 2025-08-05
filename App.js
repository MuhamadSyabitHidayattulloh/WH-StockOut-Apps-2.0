import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './src/pages/Login';
import Home from './src/pages/Home';
import Register from './src/pages/Register';
import WOInstruction from './src/pages/WOInstruction';
import FullCameraScan from './src/pages/FullCameraScan';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUsername('');
    setIsLoggedIn(false);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000000',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#FFFFFF',
          },
        }}>
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
                headerStyle: {
                  backgroundColor: '#000000',
                },
                headerTintColor: '#FFFFFF',
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

