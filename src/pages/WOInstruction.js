import React, {useCallback, useEffect, useState} from 'react';
import {
  DeviceEventEmitter,
  Modal,
  StyleSheet,
  Text,
  Vibration,
  View,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import {GenerateOneWayKanban} from '../function/GenerateOneWayKanban';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {whStockoutApi} from '../api';
import moment from 'moment';
import SoundPlayer from 'react-native-sound-player';
import FastImage from '@d11/react-native-fast-image';
import LottieView from 'lottie-react-native';
import {useFocusEffect} from '@react-navigation/native';
import GlassBackground from '../components/GlassBackground';
import GlassInput from '../components/GlassInput';
import GlassTable from '../components/GlassTable';
import AnimatedGlassButton from '../components/AnimatedGlassButton';
import {createGlassmorphismStyles} from '../styles/glassmorphism';
import {useTheme} from '../context/ThemeContext';

const WOInstruction = ({navigation}) => {
  const {isDarkMode} = useTheme();
  const glassmorphismStyles = createGlassmorphismStyles(isDarkMode);
  
  const [data, setData] = useState([]);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDuplicateKanban, setModalDuplicateKanban] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [wrongQR, setWrongQR] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const subscription = DeviceEventEmitter.addListener('ScanEvent', data => {
        if (userId) {
          handleScanIntent(data);
        }
      });

      return () => {
        subscription.remove();
      };
    }, [userId]),
  );

  useFocusEffect(
    useCallback(() => {
      const getUserFromAsyncStorage = async () => {
        const value = await AsyncStorage.getItem('userDataLogin');
        if (value !== null) {
          const userData = JSON.parse(value);
          setUsername(userData.USERNAME);
          setUserId(userData.USERID);
        }
      };
      getUserFromAsyncStorage();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      const getAsyncStorageData = async () => {
        try {
          const value = await AsyncStorage.getItem('stockOutData');
          if (value !== null) {
            setData(JSON.parse(value));
          } else {
            setData([]);
          }
        } catch (error) {
          console.log(error);
        }
      };
      getAsyncStorageData();
    }, []),
  );

  const handleScanIntent = async e => {
    if (e.length === 30) {
      const oneWayKanbanQR = new GenerateOneWayKanban(e);
      const currentData =
        JSON.parse(await AsyncStorage.getItem('stockOutData')) || [];

      if (currentData.some(item => item.imgData === e)) {
        showModalDuplicateKanban();
        return;
      }

      const newData = {
        imgData: e,
        timeScan: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        NPK: userId,
        partNumber: oneWayKanbanQR.getPartNumber(),
        qty: oneWayKanbanQR.getQtyPerKanban(),
        processId: generateProcessId(),
      };

      const updatedData = [newData, ...currentData];
      await AsyncStorage.setItem('stockOutData', JSON.stringify(updatedData));
      setData(updatedData);
    } else {
      showWrongQR();
    }
  };

  const generateSlipNumber = () => {
    const prefix = 'F';
    const date = new Date();
    const dateStr =
      date.getFullYear().toString().slice(-1) +
      date.getDate().toString().padStart(2, '0') +
      (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return prefix + dateStr + random;
  };

  const generateProcessId = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `ST${year}${month}${date}${hours}${minutes}${seconds}`;
  };

  const handleSubmitData = async () => {
    if (data.length > 0) {
      setLoading(true);
      const slip = generateSlipNumber();
      
      try {
        await axios.post(whStockoutApi, {
          data: data,
          slip: slip,
        });
        
        await AsyncStorage.clear();
        setData([]);
        setLoading(false);
        Alert.alert('Success', 'Data submitted successfully');
      } catch (error) {
        setLoading(false);
        Alert.alert('Error', 'Something went wrong');
      }
    } else {
      Alert.alert('Error', 'Data tidak boleh kosong!');
    }
  };

  const playDuplicateSound = () => {
    try {
      SoundPlayer.playSoundFile('invalid-selection', 'mp3');
    } catch (error) {
      console.log('Error playing duplicate sound:', error);
    }
  };

  const playFailedSound = () => {
    try {
      SoundPlayer.playSoundFile('error-10', 'mp3');
    } catch (error) {
      console.log('Error playing failed sound:', error);
    }
    Vibration.vibrate(1500);
  };

  const showModalDuplicateKanban = () => {
    setModalDuplicateKanban(true);
    playDuplicateSound();
    Vibration.vibrate(1000);
  };

  const showWrongQR = () => {
    playFailedSound();
    Vibration.vibrate(1000);
    setWrongQR(true);
    setTimeout(() => {
      setWrongQR(false);
    }, 2000);
  };

  const resetData = async () => {
    if (password === '0000') {
      await AsyncStorage.removeItem('stockOutData');
      setData([]);
      setModalVisible(false);
      setPassword('');
      Alert.alert('Success', 'Reset Success');
    } else {
      setModalVisible(false);
      Alert.alert('Error', 'Wrong Password');
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#000000',
      },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: '#FFFFFF',
      },
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <GlassBackground>
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={[glassmorphismStyles.glassCard, styles.headerCard]}>
              <Text style={[glassmorphismStyles.glassTitle, styles.headerTitle]}>
                Scan Kanban untuk Stockout
              </Text>
              <Text style={[glassmorphismStyles.glassSubtitle, styles.countText]}>
                Count: {data.length}
              </Text>
            </View>
          </View>

          {/* Table Section */}
          <View style={styles.tableSection}>
            <GlassTable
              headers={[
                {title: 'No', key: 'no', flex: 1},
                {title: 'Part Number', key: 'partNumber', flex: 4},
                {title: 'Qty', key: 'qty', flex: 1.5},
                {title: 'User', key: 'NPK', flex: 1.5},
              ]}
              data={data.map((item, index) => ({
                ...item,
                no: index + 1,
              }))}
              style={styles.table}
              maxHeight={300}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <View style={styles.buttonRow}>
              <AnimatedGlassButton
                title="Scan by Camera"
                onPress={() =>
                  navigation.navigate('Full Camera Scan', {
                    scanRead: handleScanIntent,
                  })
                }
                icon="camera-alt"
                style={[styles.actionButton, {marginRight: 8}]}
              />
              <AnimatedGlassButton
                title="Selesai Belanja"
                onPress={handleSubmitData}
                variant="success"
                icon="check"
                style={[styles.actionButton, {marginLeft: 8}]}
              />
            </View>
            
            <AnimatedGlassButton
              title="Reset"
              onPress={() => setModalVisible(true)}
              variant="danger"
              icon="refresh"
              style={styles.resetButton}
            />
          </View>
        </View>
      </GlassBackground>

      {/* Reset Password Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={glassmorphismStyles.glassModal}>
          <View style={glassmorphismStyles.glassModalContent}>
            <Text style={[glassmorphismStyles.glassText, styles.modalTitle]}>
              Masukkan Password
            </Text>
            <GlassInput
              placeholder="Password"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              style={styles.modalInput}
            />
            <View style={styles.modalButtons}>
              <AnimatedGlassButton
                title="Close"
                onPress={() => setModalVisible(false)}
                variant="secondary"
                style={[styles.modalButton, {marginRight: 8}]}
              />
              <AnimatedGlassButton
                title="Submit"
                onPress={resetData}
                style={[styles.modalButton, {marginLeft: 8}]}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Duplicate Kanban Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalDuplicateKanban}
        onRequestClose={() => setModalDuplicateKanban(false)}>
        <View style={glassmorphismStyles.glassModal}>
          <View style={glassmorphismStyles.glassModalContent}>
            <FastImage
              source={require('../assets/gif/false-so-true.gif')}
              style={styles.gifStyle}
              resizeMode="contain"
            />
            <Text style={[glassmorphismStyles.glassText, styles.duplicateText]}>
              DUPLICATE KANBAN WOII
            </Text>
            <AnimatedGlassButton
              title="Close"
              onPress={() => setModalDuplicateKanban(false)}
              variant="secondary"
              style={styles.closeButton}
            />
          </View>
        </View>
      </Modal>

      {/* Wrong QR Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={wrongQR}
        onRequestClose={() => setWrongQR(false)}>
        <View style={glassmorphismStyles.glassModal}>
          <LottieView
            source={require('../assets/animations/wrong.json')}
            autoPlay
            loop
            style={styles.animationStyle}
          />
          <Text style={[glassmorphismStyles.glassText, styles.wrongQRText]}>
            QR Salah
          </Text>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={loading}
        onRequestClose={() => setLoading(false)}>
        <View style={glassmorphismStyles.glassModal}>
          <LottieView
            source={require('../assets/animations/loading.json')}
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
    padding: 16,
  },
  headerSection: {
    marginBottom: 16,
  },
  headerCard: {
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  countText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tableSection: {
    flex: 1,
    marginBottom: 16,
  },
  table: {
    flex: 1,
  },
  actionSection: {
    paddingTop: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
  },
  resetButton: {
    alignSelf: 'center',
    width: '50%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInput: {
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
  },
  gifStyle: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  duplicateText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    width: 100,
  },
  animationStyle: {
    width: 200,
    height: 200,
  },
  wrongQRText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default WOInstruction;

