import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import {glassmorphismStyles} from '../styles/glassmorphism';
import Icon from 'react-native-vector-icons/MaterialIcons';

const GlassInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  style,
  inputRef,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        ref={inputRef}
        style={[
          glassmorphismStyles.glassInput,
          isFocused && styles.focusedInput,
        ]}
        placeholder={placeholder}
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {secureTextEntry && (
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={togglePasswordVisibility}>
          <Icon
            name={isPasswordVisible ? 'visibility' : 'visibility-off'}
            size={24}
            color="rgba(255, 255, 255, 0.6)"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 16,
  },
  focusedInput: {
    borderColor: 'rgba(59, 130, 246, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
});

export default GlassInput;

