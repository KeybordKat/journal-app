import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens (we'll create these next)
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';

import { theme } from '../styles/theme';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Today') {
              iconName = focused ? 'today' : 'today-outline';
            } else if (route.name === 'History') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Stats') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textLight,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
            paddingBottom: 5,
            paddingTop: 5,
            height: 65,
          },
          headerStyle: {
            backgroundColor: theme.colors.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitleStyle: {
            color: theme.colors.text,
            fontSize: theme.typography.fontSize.xl,
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen 
          name=\"Today\" 
          component={HomeScreen}
          options={{ 
            title: 'Today',
            headerTitle: 'Today\'s Journal'
          }} 
        />
        <Tab.Screen 
          name=\"History\" 
          component={HistoryScreen}
          options={{ 
            title: 'History',
            headerTitle: 'Past Entries'
          }} 
        />
        <Tab.Screen 
          name=\"Stats\" 
          component={StatsScreen}
          options={{ 
            title: 'Stats',
            headerTitle: 'Your Progress'
          }} 
        />
        <Tab.Screen 
          name=\"Settings\" 
          component={SettingsScreen}
          options={{ 
            title: 'Settings',
            headerTitle: 'Settings'
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
