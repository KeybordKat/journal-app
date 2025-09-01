import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../styles';

const HistoryScreen = () => {
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView style={globalStyles.container}>
        <View style={globalStyles.paddingMd}>
          <Text style={globalStyles.subtitle}>Your Journal History</Text>
          <Text style={globalStyles.bodyText}>
            Here you'll see all your past journal entries organized by date.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;
