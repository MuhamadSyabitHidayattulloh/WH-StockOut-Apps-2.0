import React from 'react';
import {View} from 'react-native';

const Card = ({children, style}) => {
  return (
    <View className={`bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-md ${style}`}>
      {children}
    </View>
  );
};

export default Card;
