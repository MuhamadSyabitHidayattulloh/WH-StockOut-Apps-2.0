import {Input} from '@ui-kitten/components';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  DeviceEventEmitter,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import {GenerateOneWayKanban} from '../function/GenerateOneWayKanban';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {stockoutWithoutInstructionApi} from '../api';
import moment from 'moment';
import Sound from 'react-native-sound';
import FastImage from 'react-native-fast-image';
import LottieView from 'lottie-react-native';
import {useFocusEffect} from '@react-navigation/native';

const WOInstruction = ({navigation}) => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(0);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDuplicateKanban, setModalDuplicateKanban] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [wrongQR, setWrongQR] = useState(false);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('ScanEvent', data => {
      if (userId) {
        handleScanIntent(data);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [userId]);

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

  useEffect(() => {
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
  }, [update]);

  const handleScanIntent = async e => {
    const text = e;
    if (text.length === 30) {
      const oneWayKanbanQR = new GenerateOneWayKanban(text);
      const currentData =
        JSON.parse(await AsyncStorage.getItem('stockOutData')) || [];

      if (currentData.some(item => item.imgData === text)) {
        showModalDuplicateKanban();
        return;
      }

      const data = {
        imgData: text,
        timeScan: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        NPK: username,
        partNumber: oneWayKanbanQR.getPartNumber(),
        qty: oneWayKanbanQR.getQtyPerKanban(),
      };

      await AsyncStorage.setItem('currentImgData', text);
      await AsyncStorage.setItem(
        'stockOutData',
        JSON.stringify([...currentData, data]),
      );

      setData([...currentData, data]);
      Vibration.vibrate();
    } else {
      showWrongQR();
    }
  };

  const handleSubmitData = async () => {
    if (data.length > 0) {
      setLoading(true);
      axios
        .post(stockoutWithoutInstructionApi, {
          data: data.map(item => ({
            imgData: item.imgData,
            timeScan: item.timeScan,
            NPK: userId,
          })),
        })
        .then(async response => {
          await AsyncStorage.clear();
          setData([]);
          setLoading(false);
        })
        .catch(error => {
          console.log(error);
          if (error.response) {
            // const statusCode = error.response.status;
            const statusCode = error.response.data;
            console.log(statusCode);
            if (statusCode === 400) {
              alert(
                'Error!',
                'Part number tidak terdaftar. Hubungi tim warehouse',
                [{text: 'OK'}],
              );
            } else {
              alert(
                'Error!',
                `Terjadi kesalahan: ${error.response.statusText}`,
                [{text: 'OK'}],
              );
            }
          } else if (error.request) {
            alert('Unexpected Error!', `Terjadi kesalahan: ${error.message}`, [
              {text: 'OK'},
            ]);
          }
        });
    } else {
      alert('Data tidak boleh kosong !');
    }
  };

  const playDuplicateSound = () => {
    const duplicateSound = new Sound(
      require('../assets/sounds/invalid-selection.mp3'),
      error => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        duplicateSound.play();
      },
    );
  };

  const playFailedSound = () => {
    const failedSound = new Sound(
      require('../assets/sounds/error-10.mp3'),
      error => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        failedSound.play();
      },
    );
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
      await AsyncStorage.clear();
      setData([]);
      setUpdate(update + 1);
      setModalVisible(false);
      setPassword('');
      alert('Reset Success');
    } else {
      setModalVisible(false);
      alert('Wrong Password');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Scan untuk belanja</Text>
        <View style={[styles.table, {width: '100%'}]}>
          {/* Table Header */}
          <View style={styles.headerRow}>
            <View
              style={[
                styles.cellNo,
                styles.topLeftTable,
                styles.headerCell,
                {width: '10%'},
              ]}>
              <Text style={[styles.headerText]}>No</Text>
            </View>
            <View style={[styles.cellPn, styles.headerCell, {width: '50%'}]}>
              <Text style={[styles.headerText]}>Part Nomor</Text>
            </View>
            <View style={[styles.cellQty, styles.headerCell, {width: '20%'}]}>
              <Text style={[styles.headerText]}>Qty</Text>
            </View>
            <View
              style={[
                styles.cellUser,
                styles.topRightTable,
                styles.headerCell,
                {width: '20%'},
              ]}>
              <Text style={[styles.headerText]}>User</Text>
            </View>
          </View>
          {/* Table Rows */}
          {data.map((part, index) => (
            <View key={index} style={styles.row}>
              <View
                style={[
                  styles.cellNo,
                  styles.bodyCell,
                  {
                    backgroundColor: part.color ? part.color : 'white',
                    width: '10%',
                  },
                ]}>
                <Text style={styles.bodyText}>{index + 1}</Text>
              </View>
              <View
                style={[
                  styles.cellPn,
                  styles.bodyCell,
                  {
                    backgroundColor: part.color ? part.color : 'white',
                    width: '50%',
                  },
                ]}>
                <Text style={styles.bodyText}>{part.partNumber}</Text>
              </View>
              <View
                style={[
                  styles.cellQty,
                  styles.bodyCell,
                  {
                    backgroundColor: part.color ? part.color : 'white',
                    width: '20%',
                  },
                ]}>
                <Text style={styles.bodyText}>{part.qty}</Text>
              </View>
              <View
                style={[
                  styles.cellUser,
                  styles.bodyCell,
                  {
                    backgroundColor: part.color ? part.color : 'white',
                    width: '20%',
                  },
                ]}>
                <Text style={styles.bodyText}>{part.NPK}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={{marginBottom: 5}}>
        <Pressable
          style={{
            width: '100%',
            height: 50,
            borderRadius: 10,
            backgroundColor: 'rgb(46, 98, 211)',
            color: '#fff',
            padding: 10,
            borderWidth: 2,
            borderColor: 'rgb(25, 0, 255)',
          }}
          onPress={() =>
            navigation.navigate('Full Camera Scan', {
              scanRead: handleScanIntent,
            })
          }>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Scan by Camera
          </Text>
        </Pressable>
      </View>

      <View style={{marginBottom: 5}}>
        <Pressable
          style={{
            width: '100%',
            height: 50,
            borderRadius: 10,
            backgroundColor: '#4CAF50',
            color: '#fff',
            padding: 10,
            borderWidth: 2,
            borderColor: '#4CAF50',
          }}
          onPress={handleSubmitData}>
          <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>
            Selesai Belanja
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          textAlign: 'right',
          flexDirection: 'row',
        }}>
        <Pressable
          style={{
            width: '100%',
            height: 50,
            borderRadius: 10,
            backgroundColor: 'red',
            color: '#fff',
            padding: 10,
            borderWidth: 2,
            borderColor: 'rgb(240, 108, 32)',
          }}
          onPress={() => setModalVisible(true)}>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Reset
          </Text>
        </Pressable>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Masukkan Password</Text>
            <Input
              placeholder="Password"
              secureTextEntry={true}
              style={{marginBottom: 20}}
              value={password}
              onChangeText={text => setPassword(text)}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Pressable
                style={[styles.button, styles.buttonClose, {marginRight: 10}]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={resetData}>
                <Text style={styles.textStyle}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalDuplicateKanban}
        onRequestClose={() => {
          setModalSupplyIncomplete(!modalDuplicateKanban);
        }}>
        <View style={styles.modalCondition}>
          <View style={styles.modalView}>
            <FastImage
              source={require('../assets/gif/false-so-true.gif')}
              style={{width: 250, height: 250, marginBottom: 5}}
              resizeMode="contain"
            />
            <Text
              style={
                (styles.modalText,
                {fontSize: 20, fontWeight: 'bold', marginBottom: 10})
              }>
              DUPLICATE KANBAN WOII
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Pressable
                style={[
                  styles.button,
                  styles.buttonClose,
                  {marginRight: 10, width: 100, height: 50},
                ]}
                onPress={() => setModalDuplicateKanban(!modalDuplicateKanban)}>
                <Text
                  style={[
                    styles.textStyle,
                    {
                      alignContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                    },
                  ]}>
                  Close
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={wrongQR}
        onRequestClose={() => {
          setWrongQR(false);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <LottieView
            source={require('../assets/animations/wrong.json')}
            autoPlay
            loop
            style={{width: 200, height: 200}}
          />
          <Text style={{color: 'white', fontSize: 24, fontWeight: 'bold'}}>
            QR Salah
          </Text>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={loading}
        onRequestClose={() => {
          setLoading(false);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <LottieView
            source={require('../assets/animations/loading.json')}
            autoPlay
            loop
            style={{width: 200, height: 200}}
          />
        </View>
      </Modal>

      {/* <Footer userName={username} onLogout={handleLogout} /> */}
    </View>
  );
};

export default WOInstruction;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flex: 1,
  },
  listItemText: {
    fontSize: 16,
    flex: 4,
  },
  button: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
  },
  modalCondition: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 200,
    height: 200,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  header: {
    fontWeight: 'bold',
    backgroundColor: '#f2f2f2',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalViewShopping: {
    margin: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    blurRadius: 10,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonModalShop: {
    borderRadius: 20,
    padding: 20,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  buttonNo: {
    backgroundColor: '#ff1919',
  },
  buttonYes: {
    backgroundColor: '#2eff13',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalTextShopping: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 15,
  },
  tableContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 0,
    marginBottom: 5,
    paddingBottom: 20,
  },
  table: {
    flexDirection: 'column',
    alignItems: 'center',
    width: screenWidth,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#848584',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexWrap: 'wrap',
  },

  cellNo: {
    width: 50,
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  cellPn: {
    width: 150,
    borderRightWidth: 1,
    paddingLeft: 1,
    paddingRight: 3,
  },
  cellQty: {
    width: 75,
    borderRightWidth: 1,
  },
  cellUser: {
    width: 65,
    borderRightWidth: 1,
  },
  headerCell: {
    backgroundColor: '#A3A5A5',
    borderColor: '#848584',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    color: 'black',
    paddingVertical: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  bodyCell: {
    borderColor: '#848584',
    backgroundColor: '#fff',
  },
  bodyText: {
    color: 'black',
    borderColor: '#848584',
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 13,
  },
  topLeftTable: {
    borderTopLeftRadius: 15,
  },
  topRightTable: {
    borderTopRightRadius: 15,
  },
});
