import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {glassmorphismStyles} from '../styles/glassmorphism';

const FullCameraScan = ({navigation, route}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [flashOn, setFlashOn] = useState(false);
  const camera = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;

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
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View style={styles.permissionContainer}>
          <View style={[glassmorphismStyles.glassCard, styles.permissionCard]}>
            <Icon name="camera-alt" size={64} color="#FFFFFF" style={styles.permissionIcon} />
            <Text style={[glassmorphismStyles.glassTitle, styles.permissionTitle]}>
              Camera Permission Required
            </Text>
            <Text style={[glassmorphismStyles.glassSubtitle, styles.permissionText]}>
              Please grant camera permission to scan QR codes
            </Text>
            <TouchableOpacity
              style={[glassmorphismStyles.glassButton, styles.permissionButton]}
              onPress={checkCameraPermission}>
              <Text style={glassmorphismStyles.glassText}>
                Grant Permission
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!device) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View style={styles.permissionContainer}>
          <View style={[glassmorphismStyles.glassCard, styles.permissionCard]}>
            <Icon name="camera-alt" size={64} color="#FFFFFF" style={styles.permissionIcon} />
            <Text style={[glassmorphismStyles.glassTitle, styles.permissionTitle]}>
              Camera Not Available
            </Text>
            <Text style={[glassmorphismStyles.glassSubtitle, styles.permissionText]}>
              No camera device found
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={isActive}
        torch={flashOn ? 'on' : 'off'}
        codeScanner={{
          codeTypes: ['qr', 'ean-13'],
          onCodeScanned: onCodeScanned,
        }}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[glassmorphismStyles.glassButton, styles.headerButton]}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={[glassmorphismStyles.glassContainer, styles.titleContainer]}>
            <Text style={[glassmorphismStyles.glassText, styles.headerTitle]}>
              Scan QR Code
            </Text>
          </View>
          
          <TouchableOpacity
            style={[glassmorphismStyles.glassButton, styles.headerButton]}
            onPress={toggleFlash}>
            <Icon 
              name={flashOn ? "flash-on" : "flash-off"} 
              size={24} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        </View>

        {/* Scanning Area */}
        <View style={styles.scanningArea}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <View style={[glassmorphismStyles.glassCard, styles.instructionCard]}>
            <Text style={[glassmorphismStyles.glassText, styles.instructionText]}>
              Position the QR code within the frame
            </Text>
            <Text style={[glassmorphismStyles.glassSubtitle, styles.instructionSubtext]}>
              The camera will automatically scan when detected
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scanningArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructions: {
    padding: 20,
    paddingBottom: 40,
  },
  instructionCard: {
    padding: 16,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  instructionSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  permissionCard: {
    padding: 32,
    alignItems: 'center',
    width: '100%',
  },
  permissionIcon: {
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 24,
    marginBottom: 16,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
});

export default FullCameraScan;

