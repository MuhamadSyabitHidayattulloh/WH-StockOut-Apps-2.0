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
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
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
import Icon from 'react-native-vector-icons/MaterialIcons';
import {handleApiError} from '../function/General';

const WOInstruction = ({navigation}) => {
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

      // Validate QR code data
      try {
        const partNumber = oneWayKanbanQR.getPartNumber();
        const qty = oneWayKanbanQR.getQtyPerKanban();
        const whCode = oneWayKanbanQR.getWhCode();
        const uniqueCode = oneWayKanbanQR.getUniqueCode();

        // Validate required fields
        if (!partNumber || !qty || !whCode || !uniqueCode) {
          showWrongQR();
          return;
        }

        // Validate quantity is positive number
        if (isNaN(qty) || qty <= 0) {
          showWrongQR();
          return;
        }

        const newData = {
          imgData: e,
          timeScan: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          NPK: userId,
          partNumber: partNumber,
          qty: qty,
          processId: generateProcessId(),
        };

        const updatedData = [...currentData, newData];
        await AsyncStorage.setItem('stockOutData', JSON.stringify(updatedData));
        setData(updatedData);
      } catch (error) {
        console.error('QR validation error:', error);
        showWrongQR();
      }
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
        const response = await axios.post(whStockoutApi, {
          data: data,
          slip: slip,
        });
        
        // Check if backend response is successful
        if (response.data.msg === "Stockout Success") {
          await AsyncStorage.removeItem('stockOutData');
          setData([]);
          setLoading(false);
          Alert.alert('Success', 'Data submitted successfully');
        } else {
          setLoading(false);
          Alert.alert('Error', response.data.msg || 'Something went wrong');
        }
      } catch (error) {
        setLoading(false);
        const errorInfo = handleApiError(error);
        Alert.alert('Error', errorInfo.message);
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

  const renderTableHeader = () => (
    <View className="bg-gray-700 rounded-t-xl p-4 flex-row">
      <Text className="text-white font-semibold text-xs flex-1 text-center">No</Text>
      <Text className="text-white font-semibold text-xs flex-4 text-center">Part Number</Text>
      <Text className="text-white font-semibold text-xs flex-1 text-center">Qty</Text>
      <Text className="text-white font-semibold text-xs flex-1 text-center">User</Text>
    </View>
  );

  const renderTableRow = ({item, index}) => (
    <View className={`p-4 flex-row border-b border-gray-700 ${index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/50'}`}>
      <Text className="text-gray-300 text-xs flex-1 text-center">{index + 1}</Text>
      <Text className="text-gray-300 text-xs flex-4 text-center">{item.partNumber}</Text>
      <Text className="text-gray-300 text-xs flex-1 text-center">{item.qty}</Text>
      <Text className="text-gray-300 text-xs flex-1 text-center">{item.NPK}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#1f2937" />
      
      <View className="flex-1 p-4">
        {/* Header Section */}
        <View className="mb-6">
          <View className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-4 border border-gray-700/50">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-blue-600 rounded-xl items-center justify-center mr-3">
                  <Icon name="inventory" size={24} color="#ffffff" />
                </View>
                <View>
                  <Text className="text-white text-lg font-bold">
                    Scan Kanban untuk Stockout
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    User: {username}
                  </Text>
                </View>
              </View>
              <View className="bg-blue-600/20 rounded-xl px-3 py-2">
                <Text className="text-blue-400 font-semibold">
                  Count: {data.length}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Table Section */}
        <View className="flex-1 mb-6">
          <View className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 overflow-hidden">
            {renderTableHeader()}
            {data.length > 0 ? (
              <FlatList
                data={data}
                renderItem={renderTableRow}
                keyExtractor={(item, index) => index.toString()}
                className="max-h-80"
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View className="p-8 items-center">
                <Icon name="inbox" size={48} color="#6B7280" />
                <Text className="text-gray-400 text-center mt-2">
                  No data scanned yet
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-3">
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="flex-1 bg-blue-600 rounded-xl py-4 flex-row items-center justify-center"
              onPress={() =>
                navigation.navigate('Full Camera Scan', {
                  scanRead: handleScanIntent,
                })
              }
              activeOpacity={0.8}>
              <Icon name="camera-alt" size={20} color="#ffffff" />
              <Text className="text-white font-semibold text-lg ml-2">
                Scan by Camera
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 bg-green-600 rounded-xl py-4 flex-row items-center justify-center"
              onPress={handleSubmitData}
              activeOpacity={0.8}>
              <Icon name="check" size={20} color="#ffffff" />
              <Text className="text-white font-semibold text-lg ml-2">
                Selesai Belanja
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            className="bg-red-600/20 border border-red-600/50 rounded-xl py-4 flex-row items-center justify-center"
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}>
            <Icon name="refresh" size={20} color="#EF4444" />
            <Text className="text-red-400 font-semibold text-lg ml-2">
              Reset Data
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Reset Password Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-black/80 justify-center items-center p-6">
          <View className="bg-gray-800 rounded-2xl p-6 w-full max-w-sm border border-gray-700">
            <Text className="text-white text-xl font-bold text-center mb-6">
              Masukkan Password
            </Text>
            
            <View className="bg-gray-700/50 rounded-xl border border-gray-600/50 flex-row items-center px-4 mb-6">
              <Icon name="lock" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 text-white py-4 px-3"
                placeholder="Enter password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
            </View>
            
            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1 bg-gray-700 rounded-xl py-3"
                onPress={() => setModalVisible(false)}
                activeOpacity={0.8}>
                <Text className="text-gray-300 font-semibold text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-blue-600 rounded-xl py-3"
                onPress={resetData}
                activeOpacity={0.8}>
                <Text className="text-white font-semibold text-center">
                  Submit
                </Text>
              </TouchableOpacity>
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
        <View className="flex-1 bg-black/80 justify-center items-center p-6">
          <View className="bg-gray-800 rounded-2xl p-6 items-center border border-gray-700">
            <FastImage
              source={require('../assets/gif/false-so-true.gif')}
              style={{width: 200, height: 200}}
              resizeMode="contain"
            />
            <Text className="text-red-400 text-xl font-bold text-center mt-4 mb-6">
              DUPLICATE KANBAN WOII
            </Text>
            <TouchableOpacity
              className="bg-red-600 rounded-xl py-3 px-8"
              onPress={() => setModalDuplicateKanban(false)}
              activeOpacity={0.8}>
              <Text className="text-white font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Wrong QR Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={wrongQR}
        onRequestClose={() => setWrongQR(false)}>
        <View className="flex-1 bg-black/80 justify-center items-center">
          <View className="items-center">
            <LottieView
              source={require('../assets/animations/wrong.json')}
              autoPlay
              loop
              style={{width: 200, height: 200}}
            />
            <Text className="text-red-400 text-2xl font-bold text-center mt-4">
              QR Salah
            </Text>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={loading}
        onRequestClose={() => setLoading(false)}>
        <View className="flex-1 bg-black/80 justify-center items-center">
          <View className="items-center">
            <LottieView
              source={require('../assets/animations/loading.json')}
              autoPlay
              loop
              style={{width: 200, height: 200}}
            />
            <Text className="text-white text-lg font-semibold text-center mt-4">
              Submitting Data...
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default WOInstruction;

