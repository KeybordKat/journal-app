import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../styles';

const StatsScreen = () => {
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView style={globalStyles.container}>
        <View style={globalStyles.paddingMd}>
          <Text style={globalStyles.subtitle}>Your Progress</Text>
          <Text style={globalStyles.bodyText}>
            Track your goal completion rates, streaks, and other insights here.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StatsScreen;
