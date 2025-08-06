import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import {checkUserIDAPI, registerAccountAPI} from '../api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import md5 from 'md5';
import {validateNPK, validatePassword, validateEmail, validateRequiredField, handleApiError} from '../function/General';
import {useTheme} from '../context/ThemeContext';

const Register = ({navigation}) => {
  const {colors, isDarkMode} = useTheme();
  const [npk, setNpk] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [plant, setPlant] = useState('');
  const [buCode, setBuCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Refs for input fields
  const npkRef = useRef(null);
  const nameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const companyRef = useRef(null);
  const plantRef = useRef(null);
  const buCodeRef = useRef(null);
  const emailRef = useRef(null);

  const handleRegister = async () => {
    // Validate all required fields
    const npkValidation = validateNPK(npk);
    const passwordValidation = validatePassword(password);
    const nameValidation = validateRequiredField(name, 'Name');
    const companyValidation = validateRequiredField(company, 'Company Code');
    const plantValidation = validateRequiredField(plant, 'Plant Code');
    const buCodeValidation = validateRequiredField(buCode, 'BU Code');
    const emailValidation = validateEmail(email);

    if (!npkValidation.isValid) {
      Alert.alert('Error', npkValidation.message);
      return;
    }

    if (!nameValidation.isValid) {
      Alert.alert('Error', nameValidation.message);
      return;
    }

    if (!passwordValidation.isValid) {
      Alert.alert('Error', passwordValidation.message);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!companyValidation.isValid) {
      Alert.alert('Error', companyValidation.message);
      return;
    }

    if (!plantValidation.isValid) {
      Alert.alert('Error', plantValidation.message);
      return;
    }

    if (!buCodeValidation.isValid) {
      Alert.alert('Error', buCodeValidation.message);
      return;
    }

    if (!emailValidation.isValid) {
      Alert.alert('Error', emailValidation.message);
      return;
    }

    setLoading(true);
    try {
      // Check if NPK already exists
      const checkResponse = await axios.post(checkUserIDAPI, {
        userID: npk,
      });

      // Backend returns "userExisted" or "notExisted" as string
      if (checkResponse.data === "userExisted") {
        Alert.alert('Error', 'NPK already registered');
        setLoading(false);
        return;
      }

      // Register new account with all required fields
      const registerResponse = await axios.post(registerAccountAPI, {
        userID: npk,
        password: password, // Backend will hash this with md5
        name: name,
        company: company,
        plant: plant,
        buCode: buCode,
        email: email || '-', // Default value if empty
      });

      // Backend returns "addedNewUser" or "failedToAddNewUser" as string
      if (registerResponse.data === "addedNewUser") {
        Alert.alert(
          'Success',
          'Account created successfully! Please login with your credentials.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    } catch (error) {
      const errorInfo = handleApiError(error);
      Alert.alert('Error', errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const InputField = React.useCallback(({icon, placeholder, value, onChangeText, secureTextEntry = false, required = false, keyboardType = 'default', autoComplete = 'off', inputRef, onSubmitEditing}) => (
    <View className="mb-4">
      <View style={{backgroundColor: colors.surface}} className="rounded-xl border border-gray-600/50 flex-row items-center px-4">
        <Icon name={icon} size={20} color={colors.textSecondary} />
        <TextInput
          ref={inputRef}
          style={{color: colors.text}}
          className="flex-1 py-4 px-3"
          placeholder={placeholder + (required ? ' *' : '')}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          autoCapitalize={secureTextEntry ? 'none' : 'words'}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          autoCorrect={false}
          spellCheck={false}
          blurOnSubmit={false}
          returnKeyType="next"
          enablesReturnKeyAutomatically={true}
          onSubmitEditing={onSubmitEditing}
          contextMenuHidden={true}
          selectTextOnFocus={false}
          caretHidden={false}
        />
      </View>
    </View>
  ), [colors]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.primary}}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.primary} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          contentContainerStyle={{flexGrow: 1}}
        >
        <View className="p-6">
          {/* Header */}
          <View className="items-center mb-8 mt-4">
            <View className="w-20 h-20 bg-green-600 rounded-full items-center justify-center mb-4">
              <Icon name="person-add" size={40} color="#ffffff" />
            </View>
            <Text style={{color: colors.text}} className="text-3xl font-bold mb-2">
              Create Account
            </Text>
            <Text style={{color: colors.textSecondary}} className="text-center">
              Join WH StockOut Management System
            </Text>
          </View>

          {/* Registration Form */}
          <View style={{backgroundColor: colors.card}} className="backdrop-blur-lg rounded-3xl p-6 border border-gray-700/50 mb-6">
            <Text style={{color: colors.text}} className="text-lg font-semibold text-center mb-6">
              Fill in your information
            </Text>
            
            <InputField
              icon="person"
              placeholder="NPK (Employee ID)"
              value={npk}
              onChangeText={setNpk}
              required={true}
              inputRef={npkRef}
              keyboardType="default"
              autoComplete="username"
              onSubmitEditing={() => nameRef.current?.focus()}
            />
            
            <InputField
              icon="badge"
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              required={true}
              inputRef={nameRef}
              keyboardType="default"
              autoComplete="name"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
            
            <InputField
              icon="lock"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              required={true}
              inputRef={passwordRef}
              keyboardType="default"
              autoComplete="password"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            />
            
            <InputField
              icon="lock-outline"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              required={true}
              inputRef={confirmPasswordRef}
              keyboardType="default"
              autoComplete="password"
              onSubmitEditing={() => companyRef.current?.focus()}
            />

            <InputField
              icon="business"
              placeholder="Company Code"
              value={company}
              onChangeText={setCompany}
              required={true}
              inputRef={companyRef}
              keyboardType="default"
              autoComplete="off"
              onSubmitEditing={() => plantRef.current?.focus()}
            />

            <InputField
              icon="location-on"
              placeholder="Plant Code"
              value={plant}
              onChangeText={setPlant}
              required={true}
              inputRef={plantRef}
              keyboardType="default"
              autoComplete="off"
              onSubmitEditing={() => buCodeRef.current?.focus()}
            />

            <InputField
              icon="code"
              placeholder="BU Code"
              value={buCode}
              onChangeText={setBuCode}
              required={true}
              inputRef={buCodeRef}
              keyboardType="default"
              autoComplete="off"
              onSubmitEditing={() => emailRef.current?.focus()}
            />

            <InputField
              icon="email"
              placeholder="Email (Optional)"
              value={email}
              onChangeText={setEmail}
              required={false}
              inputRef={emailRef}
              keyboardType="email-address"
              autoComplete="email"
              onSubmitEditing={() => emailRef.current?.blur()}
            />

            {/* Register Button */}
            <TouchableOpacity
              className={`bg-green-600 rounded-xl py-4 items-center mb-4 flex-row justify-center ${
                loading ? 'opacity-50' : ''
              }`}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}>
              <Icon name="person-add" size={20} color="#ffffff" />
              <Text className="text-white font-semibold text-lg ml-2">
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Terms */}
            <Text style={{color: colors.textSecondary}} className="text-xs text-center mb-4">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>

          {/* Login Link */}
          <View className="flex-row justify-center">
            <Text style={{color: colors.textSecondary}}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-green-400 font-medium">Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="items-center mt-8 mb-4">
            <Text style={{color: colors.textMuted}} className="text-xs">
              © PED - Denso Indonesia 2025
            </Text>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;

