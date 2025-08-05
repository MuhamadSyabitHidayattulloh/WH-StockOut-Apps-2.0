import React from 'react';
import { View, Text, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import Card from '../components/Card';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

const InfoCard = ({ title, icon, children }) => (
  <Card style="mb-4">
    <View className="flex-row items-center mb-3">
      <Icon name={icon} size={24} className="text-text-primary-light dark:text-text-primary-dark" />
      <Text className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark ml-3">{title}</Text>
    </View>
    <Text className="text-base text-text-secondary-light dark:text-text-secondary-dark">{children}</Text>
  </Card>
);

const About = () => {
  const { isDarkMode } = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView>
        <View className="p-6">
          <Text className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8 text-center">About</Text>

          <InfoCard title="WH StockOut Apps 2.0" icon="inventory">
            Aplikasi untuk mengelola stok keluar warehouse dengan sistem scan QR code Kanban.
          </InfoCard>

          <InfoCard title="Version" icon="code">
            Version 2.0.0{"\n"}
            React Native 0.80.2
          </InfoCard>

          <InfoCard title="Developer" icon="person">
            PED - Denso Indonesia{"\n"}
            2025
          </InfoCard>

          <InfoCard title="Features" icon="star">
            • QR Code Scanning{"\n"}
            • Kanban Management{"\n"}
            • Stock Out Tracking{"\n"}
            • Light/Dark Mode
          </InfoCard>

          <InfoCard title="Technology Stack" icon="build">
            • React Native 0.80.2{"\n"}
            • React Navigation{"\n"}
            • AsyncStorage{"\n"}
            • React Native Vision Camera{"\n"}
            • Lottie Animations{"\n"}
            • Vector Icons{"\n"}
            • NativeWind (Tailwind)
          </InfoCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default About;
