import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Linking,
  AppState,
} from 'react-native';
import {
  Camera,
  useCameraDevices,
  useCodeScanner,
} from 'react-native-vision-camera';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../context/ThemeContext';

const FullCameraScan = ({navigation, route}) => {
  const {colors, isDarkMode} = useTheme();
  const [hasPermission, setHasPermission] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [flashOn, setFlashOn] = useState(false);
  const devices = useCameraDevices();
  
  // Helper function to get the best available camera device
  const getBestCameraDevice = (devices) => {
    // Priority: back camera first, then any available device
    if (devices.back) {
      return devices.back;
    }
    
    // Get all available devices and find back camera by position
    const availableDevices = Object.values(devices).filter(d => d !== undefined);
    
    // Look for back camera by checking device properties
    const backCamera = availableDevices.find(device => 
      device.position === 'back' || 
      device.hasFlash || 
      device.supportsLowLightBoost === false
    );
    
    if (backCamera) {
      return backCamera;
    }
    
    // Fallback to first available device
    if (availableDevices.length > 0) {
      return availableDevices[0];
    }
    
    return null;
  };
  
  const device = getBestCameraDevice(devices);
  const appState = useRef(AppState.currentState);

  const {scanRead} = route.params || {};

  useEffect(() => {
    checkCameraPermission();
    
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
      appState.current = nextAppState;
    });

    return () => subscription?.remove();
  }, []);

  const checkCameraPermission = async () => {
    try {
      const permission = await check(PERMISSIONS.ANDROID.CAMERA);
      
      if (permission === RESULTS.GRANTED) {
        setHasPermission(true);
      } else if (permission === RESULTS.DENIED) {
        const result = await request(PERMISSIONS.ANDROID.CAMERA);
        setHasPermission(result === RESULTS.GRANTED);
      } else {
        setHasPermission(false);
      }
    } catch (error) {
      setHasPermission(false);
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && scanRead) {
        const scannedData = codes[0].value;
        scanRead(scannedData);
        navigation.goBack();
      }
    },
  });

  const openSettings = () => {
    Alert.alert(
      'Camera Permission Required',
      'Please enable camera permission in settings to use QR scanner.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Open Settings', onPress: () => Linking.openSettings()},
      ]
    );
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  if (!hasPermission) {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: colors.primary}}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.primary} />
        
        <View className="flex-1 justify-center items-center p-6">
          <View style={{backgroundColor: colors.card}} className="backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50 items-center">
            <View className="w-20 h-20 bg-red-600 rounded-full items-center justify-center mb-6">
              <Icon name="camera-alt" size={40} color="#ffffff" />
            </View>
            
            <Text style={{color: colors.text}} className="text-2xl font-bold text-center mb-4">
              Camera Permission Required
            </Text>
            
            <Text style={{color: colors.textSecondary}} className="text-center mb-8 leading-6">
              This app needs camera access to scan QR codes for stock out operations. 
              Please grant camera permission to continue.
            </Text>
            
            <View className="space-y-3 w-full">
              <TouchableOpacity
                className="bg-blue-600 rounded-xl py-4 flex-row items-center justify-center"
                onPress={checkCameraPermission}
                activeOpacity={0.8}>
                <Icon name="refresh" size={20} color="#ffffff" />
                <Text className="text-white font-semibold text-lg ml-2">
                  Check Permission
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{backgroundColor: colors.surface}}
                className="rounded-xl py-4 flex-row items-center justify-center"
                onPress={openSettings}
                activeOpacity={0.8}>
                <Icon name="settings" size={20} color={colors.text} />
                <Text style={{color: colors.text}} className="font-semibold text-lg ml-2">
                  Open Settings
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="bg-red-600/20 border border-red-600/50 rounded-xl py-4 flex-row items-center justify-center"
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}>
                <Icon name="arrow-back" size={20} color="#EF4444" />
                <Text className="text-red-400 font-semibold text-lg ml-2">
                  Go Back
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!device) {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: colors.primary}}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.primary} />
        
        <View className="flex-1 justify-center items-center p-6">
          <View style={{backgroundColor: colors.card}} className="backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50 items-center">
            <View className="w-20 h-20 bg-yellow-600 rounded-full items-center justify-center mb-6">
              <Icon name="camera-alt" size={40} color="#ffffff" />
            </View>
            
            <Text style={{color: colors.text}} className="text-2xl font-bold text-center mb-4">
              Camera Not Available
            </Text>
            
            <Text style={{color: colors.textSecondary}} className="text-center mb-8">
              No camera device found on this device.
            </Text>
            
            <TouchableOpacity
              className="bg-blue-600 rounded-xl py-4 px-8 flex-row items-center"
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}>
              <Icon name="arrow-back" size={20} color="#ffffff" />
              <Text className="text-white font-semibold text-lg ml-2">
                Go Back
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View className="flex-1">
        {/* Camera View */}
        <View className="flex-1 relative">
          <Camera
            style={{flex: 1}}
            device={device}
            isActive={isActive}
            codeScanner={codeScanner}
            torch={flashOn ? 'on' : 'off'}
          />
          
          {/* Overlay */}
          <View className="absolute inset-0">
            {/* Top Overlay */}
            <View className="bg-black/50 p-6">
              <View className="flex-row items-center justify-between">
                <TouchableOpacity
                  className="w-12 h-12 bg-gray-800/80 rounded-full items-center justify-center"
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.8}>
                  <Icon name="arrow-back" size={24} color="#ffffff" />
                </TouchableOpacity>
                
                <Text className="text-white text-lg font-semibold">
                  Scan QR Code
                </Text>
                
                <TouchableOpacity
                  className={`w-12 h-12 rounded-full items-center justify-center ${
                    flashOn ? 'bg-yellow-600' : 'bg-gray-800/80'
                  }`}
                  onPress={toggleFlash}
                  activeOpacity={0.8}>
                  <Icon 
                    name={flashOn ? 'flash-on' : 'flash-off'} 
                    size={24} 
                    color="#ffffff" 
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Center Scanning Area */}
            <View className="flex-1 justify-center items-center">
              <View className="w-64 h-64 relative">
                {/* Corner Borders */}
                <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500" />
                <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500" />
                <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500" />
                <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500" />
                
                {/* Scanning Line Animation */}
                <View className="absolute inset-0 justify-center">
                  <View className="h-0.5 bg-blue-500 opacity-80" />
                </View>
              </View>
            </View>
            
            {/* Bottom Overlay */}
            <View className="bg-black/50 p-6">
              <View className="items-center">
                <Text className="text-white text-lg font-semibold mb-2">
                  Position QR code within the frame
                </Text>
                <Text className="text-gray-300 text-sm text-center">
                  Make sure the QR code is clearly visible and well-lit
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FullCameraScan;

