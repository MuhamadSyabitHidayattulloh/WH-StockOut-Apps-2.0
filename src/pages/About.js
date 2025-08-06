import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const About = () => {
  const InfoCard = ({icon, title, content, iconColor = '#9CA3AF'}) => (
    <View className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-4 border border-gray-700/50 mb-4">
      <View className="flex-row items-start">
        <View className="w-12 h-12 bg-gray-700 rounded-xl items-center justify-center mr-4">
          <Icon name={icon} size={24} color={iconColor} />
        </View>
        <View className="flex-1">
          <Text className="text-white text-lg font-semibold mb-2">{title}</Text>
          <Text className="text-gray-300 text-sm leading-6">{content}</Text>
        </View>
      </View>
    </View>
  );

  const FeatureItem = ({feature}) => (
    <View className="flex-row items-center mb-3">
      <View className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
      <Text className="text-gray-300 text-sm flex-1">{feature}</Text>
    </View>
  );

  const TechItem = ({tech}) => (
    <View className="bg-gray-700/50 rounded-lg px-3 py-2 mr-2 mb-2">
      <Text className="text-gray-300 text-xs">{tech}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#1f2937" />
      
      <ScrollView className="flex-1 p-6">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-blue-600 rounded-full items-center justify-center mb-4">
            <Icon name="inventory" size={48} color="#ffffff" />
          </View>
          <Text className="text-white text-3xl font-bold mb-2">
            WH StockOut Apps
          </Text>
          <Text className="text-blue-400 text-lg font-semibold">
            Version 2.0.0
          </Text>
        </View>

        {/* App Description */}
        <InfoCard
          icon="description"
          title="About This App"
          content="WH StockOut Apps adalah aplikasi untuk mengelola stok keluar warehouse dengan sistem scan QR code Kanban. Aplikasi ini dirancang khusus untuk meningkatkan efisiensi dan akurasi dalam proses stock out di lingkungan warehouse."
          iconColor="#3B82F6"
        />

        {/* Version Info */}
        <InfoCard
          icon="code"
          title="Version Information"
          content={`Version: 2.0.0\nReact Native: 0.80.2\nBuild: Production\nLast Updated: January 2025`}
          iconColor="#10B981"
        />

        {/* Developer Info */}
        <InfoCard
          icon="engineering"
          title="Developer"
          content={`PED - Denso Indonesia\nProduction Engineering Department\nDeveloped in 2025`}
          iconColor="#8B5CF6"
        />

        {/* Features */}
        <View className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-4 border border-gray-700/50 mb-4">
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-gray-700 rounded-xl items-center justify-center mr-4">
              <Icon name="star" size={24} color="#F59E0B" />
            </View>
            <Text className="text-white text-lg font-semibold">Key Features</Text>
          </View>
          <View className="ml-16">
            <FeatureItem feature="QR Code Scanning untuk Kanban" />
            <FeatureItem feature="Real-time Stock Out Management" />
            <FeatureItem feature="User Authentication & Authorization" />
            <FeatureItem feature="Data Persistence dengan AsyncStorage" />
            <FeatureItem feature="Sound & Vibration Feedback" />
            <FeatureItem feature="Modern UI dengan NativeWind" />
            <FeatureItem feature="Dark Mode Support" />
            <FeatureItem feature="Offline Capability" />
          </View>
        </View>

        {/* Technology Stack */}
        <View className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-4 border border-gray-700/50 mb-4">
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-gray-700 rounded-xl items-center justify-center mr-4">
              <Icon name="build" size={24} color="#EF4444" />
            </View>
            <Text className="text-white text-lg font-semibold">Technology Stack</Text>
          </View>
          <View className="ml-16">
            <Text className="text-gray-400 text-sm mb-3">Frontend Framework</Text>
            <View className="flex-row flex-wrap mb-4">
              <TechItem tech="React Native 0.80.2" />
              <TechItem tech="React 19.1.0" />
              <TechItem tech="NativeWind v4" />
            </View>
            
            <Text className="text-gray-400 text-sm mb-3">Navigation & State</Text>
            <View className="flex-row flex-wrap mb-4">
              <TechItem tech="React Navigation" />
              <TechItem tech="AsyncStorage" />
              <TechItem tech="Axios" />
            </View>
            
            <Text className="text-gray-400 text-sm mb-3">Media & UI</Text>
            <View className="flex-row flex-wrap mb-4">
              <TechItem tech="React Native Vision Camera" />
              <TechItem tech="Lottie Animations" />
              <TechItem tech="Vector Icons" />
              <TechItem tech="Sound Player" />
            </View>
          </View>
        </View>

        {/* Contact */}
        <View className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-4 border border-gray-700/50 mb-4">
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-gray-700 rounded-xl items-center justify-center mr-4">
              <Icon name="contact-support" size={24} color="#06B6D4" />
            </View>
            <Text className="text-white text-lg font-semibold">Support</Text>
          </View>
          <View className="ml-16">
            <Text className="text-gray-300 text-sm mb-2">
              Untuk bantuan teknis atau pertanyaan mengenai aplikasi ini, silakan hubungi:
            </Text>
            <Text className="text-blue-400 text-sm">
              PED - Production Engineering Department
            </Text>
            <Text className="text-blue-400 text-sm">
              PT. Denso Indonesia
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center mt-8 mb-4">
          <Text className="text-gray-500 text-xs text-center">
            © 2025 PED - Denso Indonesia{'\n'}
            All rights reserved
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default About;

