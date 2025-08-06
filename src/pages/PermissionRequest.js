import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../context/ThemeContext';

const PermissionRequest = ({navigation}) => {
  const {colors, isDarkMode} = useTheme();
  const [permissions, setPermissions] = useState({
    camera: false,
    storage: false,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const permissionSteps = [
    {
      id: 'camera',
      title: 'Camera Access',
      description: 'We need camera access to scan QR codes for warehouse operations',
      icon: 'camera-alt',
      color: 'bg-blue-600',
      permission: Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
      required: true,
    },
    {
      id: 'storage',
      title: 'Storage Access',
      description: 'We need storage access to save data locally',
      icon: 'storage',
      color: 'bg-purple-600',
      permission: Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      required: false, // Optional for modern Android
    },
  ];

  useEffect(() => {
    checkAllPermissions();
  }, []);

  const checkAllPermissions = async () => {
    const permissionStatus = {};
    
    for (const step of permissionSteps) {
      if (step.permission) {
        try {
          const status = await check(step.permission);
          permissionStatus[step.id] = status === RESULTS.GRANTED;
        } catch (error) {
          console.log(`Error checking ${step.id} permission:`, error);
          // For storage permission on modern Android, consider it granted by default
          if (step.id === 'storage' && Platform.OS === 'android') {
            permissionStatus[step.id] = true;
          } else {
            permissionStatus[step.id] = false;
          }
        }
      } else {
        // For permissions that don't need explicit request
        permissionStatus[step.id] = true;
      }
    }
    
    setPermissions(permissionStatus);
  };

  const requestPermission = async (permission, permissionId) => {
    if (!permission) return true;
    
    try {
      const result = await request(permission);
      const isGranted = result === RESULTS.GRANTED;
      
      setPermissions(prev => ({
        ...prev,
        [permissionId]: isGranted,
      }));
      
      return isGranted;
    } catch (error) {
      console.log('Permission request error:', error);
      // For storage permission on modern Android, consider it granted by default
      if (permissionId === 'storage' && Platform.OS === 'android') {
        setPermissions(prev => ({
          ...prev,
          [permissionId]: true,
        }));
        return true;
      }
      return false;
    }
  };

  const handleNextStep = async () => {
    if (currentStep < permissionSteps.length - 1) {
      const currentPermission = permissionSteps[currentStep];
      const isGranted = await requestPermission(currentPermission.permission, currentPermission.id);
      
      if (isGranted || !currentPermission.permission || !currentPermission.required) {
        setCurrentStep(currentStep + 1);
      } else {
        Alert.alert(
          'Permission Required',
          `Please grant ${currentPermission.title} permission to continue.`,
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Open Settings', onPress: () => Linking.openSettings()},
          ]
        );
      }
    } else {
      // All permissions completed
      await AsyncStorage.setItem('permissionsGranted', 'true');
      navigation.replace('Login');
    }
  };

  const handleSkipStep = () => {
    if (currentStep < permissionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      AsyncStorage.setItem('permissionsGranted', 'true');
      navigation.replace('Login');
    }
  };

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  const currentPermission = permissionSteps[currentStep];
  const progress = ((currentStep + 1) / permissionSteps.length) * 100;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.primary}}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.primary} />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 py-8">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-24 h-24 bg-blue-600/20 rounded-full items-center justify-center mb-4">
              <Icon name="security" size={48} color="#3B82F6" />
            </View>
            
            <Text style={{color: colors.text}} className="text-3xl font-bold text-center mb-2">
              Welcome to WH StockOut Apps
            </Text>
            
            <Text style={{color: colors.textSecondary}} className="text-center text-lg">
              Let's set up your app permissions
            </Text>
          </View>

          {/* Progress Bar */}
          <View className="mb-8">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-300 text-sm">
                Step {currentStep + 1} of {permissionSteps.length}
              </Text>
              <Text className="text-blue-400 text-sm font-semibold">
                {Math.round(progress)}%
              </Text>
            </View>
            
            <View className="bg-gray-700 rounded-full h-2">
              <View 
                className="bg-blue-600 h-2 rounded-full"
                style={{width: `${progress}%`}}
              />
            </View>
          </View>

          {/* Current Permission Card */}
          <View className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50 mb-8">
            <View className="items-center">
              <View className={`w-20 h-20 ${currentPermission.color} rounded-full items-center justify-center mb-6`}>
                <Icon name={currentPermission.icon} size={40} color="#ffffff" />
              </View>
              
              <Text className="text-white text-2xl font-bold text-center mb-4">
                {currentPermission.title}
              </Text>
              
              <Text className="text-gray-400 text-center mb-8 leading-6">
                {currentPermission.description}
              </Text>
              
              <View className="w-full space-y-3">
                <TouchableOpacity
                  className={`${currentPermission.color} rounded-xl py-4 flex-row items-center justify-center`}
                  onPress={handleNextStep}
                  activeOpacity={0.8}>
                  <Icon name="check" size={20} color="#ffffff" />
                  <Text className="text-white font-semibold text-lg ml-2">
                    Grant Permission
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="bg-gray-700/50 border border-gray-600/50 rounded-xl py-4 flex-row items-center justify-center"
                  onPress={handleSkipStep}
                  activeOpacity={0.8}>
                  <Icon name="skip-next" size={20} color="#9CA3AF" />
                  <Text className="text-gray-300 font-semibold text-lg ml-2">
                    Skip for Now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Permission List */}
          <View className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/30">
            <Text className="text-white text-lg font-semibold mb-4">
              Required Permissions
            </Text>
            
            <View className="space-y-3">
              {permissionSteps.map((step, index) => (
                <View 
                  key={step.id}
                  className={`flex-row items-center p-3 rounded-xl ${
                    index === currentStep 
                      ? 'bg-blue-600/20 border border-blue-600/50' 
                      : permissions[step.id] 
                        ? 'bg-green-600/20 border border-green-600/50'
                        : 'bg-gray-700/50 border border-gray-600/50'
                  }`}>
                  <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                    permissions[step.id] ? 'bg-green-600' : step.color
                  }`}>
                    <Icon 
                      name={permissions[step.id] ? 'check' : step.icon} 
                      size={20} 
                      color="#ffffff" 
                    />
                  </View>
                  
                  <View className="flex-1">
                    <Text className="text-white font-semibold">
                      {step.title}
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      {permissions[step.id] ? 'Granted' : step.required ? 'Required' : 'Optional'}
                    </Text>
                  </View>
                  
                  {permissions[step.id] && (
                    <Icon name="check-circle" size={24} color="#10B981" />
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Bottom Actions */}
          <View className="mt-8 space-y-3">
            <TouchableOpacity
              className="bg-gray-700/50 border border-gray-600/50 rounded-xl py-4 flex-row items-center justify-center"
              onPress={handleOpenSettings}
              activeOpacity={0.8}>
              <Icon name="settings" size={20} color="#9CA3AF" />
              <Text className="text-gray-300 font-semibold text-lg ml-2">
                Open Settings
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-red-600/20 border border-red-600/50 rounded-xl py-4 flex-row items-center justify-center"
              onPress={() => navigation.replace('Login')}
              activeOpacity={0.8}>
              <Icon name="close" size={20} color="#EF4444" />
              <Text className="text-red-400 font-semibold text-lg ml-2">
                Skip All Permissions
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PermissionRequest; 