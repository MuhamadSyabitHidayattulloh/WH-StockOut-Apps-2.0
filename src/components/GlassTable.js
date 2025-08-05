import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {glassmorphismStyles} from '../styles/glassmorphism';

const GlassTable = ({
  headers,
  data,
  style,
  headerStyle,
  rowStyle,
  cellStyle,
  maxHeight = 300,
}) => {
  return (
    <View style={[glassmorphismStyles.glassTable, styles.container, style]}>
      {/* Table Header */}
      <View style={[glassmorphismStyles.glassTableHeader, styles.headerRow, headerStyle]}>
        {headers.map((header, index) => (
          <Text
            key={index}
            style={[
              styles.headerText,
              {flex: header.flex || 1},
              cellStyle,
            ]}>
            {header.title}
          </Text>
        ))}
      </View>

      {/* Table Content */}
      <ScrollView style={[styles.tableContent, {maxHeight}]}>
        {data.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={[
              glassmorphismStyles.glassTableRow,
              styles.row,
              rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow,
              rowStyle,
            ]}>
            {headers.map((header, cellIndex) => (
              <Text
                key={cellIndex}
                style={[
                  styles.bodyText,
                  {flex: header.flex || 1},
                  cellStyle,
                ]}>
                {row[header.key] || ''}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  headerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  tableContent: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  evenRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  oddRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  bodyText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default GlassTable;

