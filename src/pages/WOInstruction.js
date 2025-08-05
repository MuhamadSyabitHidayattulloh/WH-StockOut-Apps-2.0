import React, {useCallback, useEffect, useState} from 'react';
import {
  DeviceEventEmitter,
  Modal,
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
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Table from '../components/Table';
import {useTheme} from '../context/ThemeContext';

const WOInstruction = ({navigation}) => {
  const [data, setData] = useState([]);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDuplicateKanban, setModalDuplicateKanban] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [wrongQR, setWrongQR] = useState(false);
  const {isDarkMode} = useTheme();

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
    }, [userId, data]), // Added data to dependency array
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

      if (data.some(item => item.imgData === e)) {
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

      const updatedData = [newData, ...data];
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
        
        await AsyncStorage.removeItem('stockOutData');
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
        backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
      },
      headerTintColor: isDarkMode ? '#FFFFFF' : '#111827',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: isDarkMode ? '#FFFFFF' : '#111827',
      },
    });
  }, [navigation, isDarkMode]);

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View className="flex-1 p-4">
        {/* Header Section */}
        <Card style="mb-4 items-center">
          <Text className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Scan Kanban untuk Stockout
          </Text>
          <Text className="text-lg text-text-secondary-light dark:text-text-secondary-dark mt-2">
            Count: {data.length}
          </Text>
        </Card>

        {/* Table Section */}
        <View className="flex-1 mb-4">
          <Table
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
            maxHeight={300}
          />
        </View>

        {/* Action Buttons */}
        <View>
          <View className="flex-row mb-3">
            <Button
              title="Scan by Camera"
              onPress={() =>
                navigation.navigate('Full Camera Scan', {
                  scanRead: handleScanIntent,
                })
              }
              style="flex-1 mr-2"
            />
            <Button
              title="Selesai Belanja"
              onPress={handleSubmitData}
              variant="success"
              style="flex-1 ml-2"
            />
          </View>

          <Button
            title="Reset"
            onPress={() => setModalVisible(true)}
            variant="danger"
          />
        </View>
      </View>

      {/* Reset Password Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-center items-center bg-black/50 p-6">
          <Card style="w-full">
            <Text className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark text-center mb-4">
              Masukkan Password
            </Text>
            <Input
              placeholder="Password"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
            <View className="flex-row">
              <Button
                title="Close"
                onPress={() => setModalVisible(false)}
                variant="secondary"
                style="flex-1 mr-2"
              />
              <Button
                title="Submit"
                onPress={resetData}
                style="flex-1 ml-2"
              />
            </View>
          </Card>
        </View>
      </Modal>

      {/* Duplicate Kanban Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalDuplicateKanban}
        onRequestClose={() => setModalDuplicateKanban(false)}>
        <View className="flex-1 justify-center items-center bg-black/50 p-6">
          <Card style="w-full items-center">
            <FastImage
              source={require('../gif/false-so-true.gif')}
              style={{width: 200, height: 200, marginBottom: 16}}
              resizeMode="contain"
            />
            <Text className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark text-center mb-4">
              DUPLICATE KANBAN WOII
            </Text>
            <Button
              title="Close"
              onPress={() => setModalDuplicateKanban(false)}
              variant="secondary"
              style="w-32"
            />
          </Card>
        </View>
      </Modal>

      {/* Wrong QR Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={wrongQR}
        onRequestClose={() => setWrongQR(false)}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <LottieView
            source={require('../animations/wrong.json')}
            autoPlay
            loop
            style={{width: 200, height: 200}}
          />
          <Text className="text-2xl font-bold text-white text-center mt-4">
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
        <View className="flex-1 justify-center items-center bg-black/50">
          <LottieView
            source={require('../animations/loading.json')}
            autoPlay
            loop
            style={{width: 200, height: 200}}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default WOInstruction;
