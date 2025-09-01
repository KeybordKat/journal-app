import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../styles';

const SettingsScreen = () => {
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView style={globalStyles.container}>
        <View style={globalStyles.paddingMd}>
          <Text style={globalStyles.subtitle}>Settings</Text>
          <Text style={globalStyles.bodyText}>
            Customize your journaling experience here.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
