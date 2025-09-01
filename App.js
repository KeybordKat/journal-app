import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { JournalProvider } from './src/context/JournalContext';
import { initDatabase } from './src/services/database';

export default function App() {
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initDatabase();
        console.log('App initialized successfully');
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    setupDatabase();
  }, []);

  return (
    <JournalProvider>
      <AppNavigator />
      <StatusBar style="dark" backgroundColor="#FDF8F6" />
    </JournalProvider>
  );
}
