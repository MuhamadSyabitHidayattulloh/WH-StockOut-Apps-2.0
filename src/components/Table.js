import React from 'react';
import {View, Text, ScrollView} from 'react-native';

const Table = ({headers, data, maxHeight}) => {
  return (
    <View className="border border-border-light dark:border-border-dark rounded-lg">
      {/* Header */}
      <View className="flex-row bg-secondary-light dark:bg-secondary-dark p-3 rounded-t-lg">
        {headers.map(header => (
          <Text
            key={header.key}
            className="font-bold text-text-primary-light dark:text-text-primary-dark"
            style={{flex: header.flex || 1}}>
            {header.title}
          </Text>
        ))}
      </View>

      {/* Body */}
      <ScrollView style={{maxHeight: maxHeight}}>
        {data.map((row, rowIndex) => (
          <View
            key={rowIndex}
            className={`flex-row p-3 border-t border-border-light dark:border-border-dark ${
              rowIndex % 2 === 0 ? 'bg-background-light dark:bg-background-dark' : 'bg-card-light dark:bg-card-dark'
            }`}>
            {headers.map(header => (
              <Text
                key={header.key}
                className="text-text-secondary-light dark:text-text-secondary-dark"
                style={{flex: header.flex || 1}}>
                {row[header.key]}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Table;
