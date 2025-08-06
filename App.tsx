/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import "./global.css";
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, useColorScheme, View, Text } from 'react-native';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold text-blue-500">
          Welcome to Nativewind!
        </Text>
      </View>
      <NewAppScreen templateFileName="App.tsx" />
    </View>
  );
}

export default App;
