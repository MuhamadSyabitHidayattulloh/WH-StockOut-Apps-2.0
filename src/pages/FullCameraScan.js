import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Card from '../components/Card';
import Button from '../components/Button';
import {useTheme} from '../context/ThemeContext';

const FullCameraScan = ({navigation, route}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [flashOn, setFlashOn] = useState(false);
  const camera = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;
  const {isDarkMode} = useTheme();

  const {scanRead} = route.params || {};

  useEffect(() => {
    checkCameraPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsActive(true);
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      setIsActive(false);
    });

    return () => {
      unsubscribe();
      unsubscribeBlur();
    };
  }, [navigation]);

  const checkCameraPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.CAMERA);
    
    if (result === RESULTS.GRANTED) {
      setHasPermission(true);
    } else {
      const requestResult = await request(PERMISSIONS.ANDROID.CAMERA);
      setHasPermission(requestResult === RESULTS.GRANTED);
    }
  };

  const onCodeScanned = (codes) => {
    if (codes.length > 0 && scanRead) {
      const scannedData = codes[0].value;
      scanRead(scannedData);
      navigation.goBack();
    }
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  if (!hasPermission) {
    return (
      <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View className="flex-1 justify-center items-center p-6">
          <Card style="w-full items-center">
            <Icon name="camera-alt" size={64} className="text-text-primary-light dark:text-text-primary-dark mb-6" />
            <Text className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              Camera Permission Required
            </Text>
            <Text className="text-base text-text-secondary-light dark:text-text-secondary-dark text-center mb-6">
              Please grant camera permission to scan QR codes
            </Text>
            <Button title="Grant Permission" onPress={checkCameraPermission} />
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  if (!device) {
    return (
      <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View className="flex-1 justify-center items-center p-6">
          <Card style="w-full items-center">
            <Icon name="camera-alt" size={64} className="text-text-primary-light dark:text-text-primary-dark mb-6" />
            <Text className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              Camera Not Available
            </Text>
            <Text className="text-base text-text-secondary-light dark:text-text-secondary-dark text-center">
              No camera device found on this device.
            </Text>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <Camera
        ref={camera}
        style={{flex: 1}}
        device={device}
        isActive={isActive}
        torch={flashOn ? 'on' : 'off'}
        codeScanner={{
          codeTypes: ['qr', 'ean-13'],
          onCodeScanned: onCodeScanned,
        }}
      />

      {/* Overlay */}
      <View className="absolute top-0 left-0 right-0 bottom-0 justify-between">
        {/* Header */}
        <View className="flex-row items-center justify-between p-5 pt-10 bg-black/30">
          <TouchableOpacity
            className="w-12 h-12 justify-center items-center rounded-full bg-black/50"
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <Text className="text-white text-lg font-bold">
            Scan QR Code
          </Text>
          
          <TouchableOpacity
            className="w-12 h-12 justify-center items-center rounded-full bg-black/50"
            onPress={toggleFlash}>
            <Icon 
              name={flashOn ? "flash-on" : "flash-off"} 
              size={24} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        </View>

        {/* Scanning Area */}
        <View className="flex-1 justify-center items-center">
          <View className="w-64 h-64 relative">
            <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white" />
            <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white" />
            <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white" />
            <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white" />
          </View>
        </View>

        {/* Instructions */}
        <View className="p-5 pb-10 items-center">
          <View className="bg-black/50 p-4 rounded-lg">
            <Text className="text-white font-semibold text-center mb-2">
              Position the QR code within the frame
            </Text>
            <Text className="text-gray-300 text-sm text-center">
              The camera will automatically scan when detected
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FullCameraScan;
