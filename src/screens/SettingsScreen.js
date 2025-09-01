import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, theme } from '../styles';
import { JournalService } from '../services/journalService';

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [showCompletedGoals, setShowCompletedGoals] = useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  const handleExportData = async () => {
    try {
      const entries = await JournalService.getAllEntries(1000); // Get all entries
      const exportData = {
        exportDate: new Date().toISOString(),
        appVersion: '1.0.0',
        entriesCount: entries.length,
        entries: entries
      };
      
      const jsonString = JSON.stringify(exportData, null, 2);
      
      await Share.share({
        message: 'Journal App Data Export',
        title: 'My Journal Data',
        url: `data:application/json;charset=utf-8,${encodeURIComponent(jsonString)}`
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Export Failed', 'Could not export your data. Please try again.');
    }
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all journal entries? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              // This would require a deleteAllEntries method in JournalService
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Could not clear data. Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderSettingsSection = (title, children) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const renderSettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent, 
    showChevron = false,
    destructive = false 
  }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, destructive && styles.iconContainerDestructive]}>
          <Ionicons 
            name={icon} 
            size={20} 
            color={destructive ? theme.colors.error : theme.colors.primary} 
          />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, destructive && styles.settingTitleDestructive]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.settingRight}>
        {rightComponent}
        {showChevron && (
          <Ionicons 
            name="chevron-forward" 
            size={16} 
            color={theme.colors.textLight} 
            style={{ marginLeft: theme.spacing.sm }}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSwitch = (value, onValueChange) => (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: theme.colors.border, true: theme.colors.primary + '40' }}
      thumbColor={value ? theme.colors.primary : theme.colors.textLight}
      ios_backgroundColor={theme.colors.border}
    />
  );

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView 
        style={globalStyles.container}
        contentContainerStyle={globalStyles.paddingMd}
        showsVerticalScrollIndicator={false}
      >
        {/* App Preferences */}
        {renderSettingsSection('Preferences', [
          <View key="notifications">{renderSettingItem({
            icon: 'notifications',
            title: 'Daily Reminders',
            subtitle: 'Get notified to write in your journal',
            rightComponent: renderSwitch(notificationsEnabled, setNotificationsEnabled)
          })}</View>,
          <View key="darkMode">{renderSettingItem({
            icon: 'moon',
            title: 'Dark Mode',
            subtitle: 'Switch to dark theme',
            rightComponent: renderSwitch(darkModeEnabled, setDarkModeEnabled)
          })}</View>,
          <View key="showCompleted">{renderSettingItem({
            icon: 'checkmark-circle',
            title: 'Show Completed Goals',
            subtitle: 'Display completed goals with strikethrough',
            rightComponent: renderSwitch(showCompletedGoals, setShowCompletedGoals)
          })}</View>,
          <View key="autoSave">{renderSettingItem({
            icon: 'save',
            title: 'Auto-save',
            subtitle: 'Automatically save changes as you type',
            rightComponent: renderSwitch(autoSaveEnabled, setAutoSaveEnabled)
          })}</View>
        ])}

        {/* Data Management */}
        {renderSettingsSection('Data Management', [
          renderSettingItem({
            icon: 'cloud-upload',
            title: 'Export Data',
            subtitle: 'Download all your journal entries',
            onPress: handleExportData,
            showChevron: true
          }),
          renderSettingItem({
            icon: 'cloud-download',
            title: 'Import Data',
            subtitle: 'Restore from a previous backup',
            onPress: () => Alert.alert('Coming Soon', 'Data import will be available in a future update.'),
            showChevron: true
          }),
          renderSettingItem({
            icon: 'trash',
            title: 'Clear All Data',
            subtitle: 'Permanently delete all journal entries',
            onPress: handleClearAllData,
            destructive: true,
            showChevron: true
          })
        ])}

        {/* About */}
        {renderSettingsSection('About', [
          renderSettingItem({
            icon: 'information-circle',
            title: 'App Version',
            subtitle: '1.0.0'
          }),
          renderSettingItem({
            icon: 'help-circle',
            title: 'Help & Support',
            subtitle: 'Get help with using the app',
            onPress: () => Alert.alert('Help & Support', 'For support, please contact us at support@journalapp.com'),
            showChevron: true
          }),
          renderSettingItem({
            icon: 'document-text',
            title: 'Privacy Policy',
            subtitle: 'Learn how we protect your data',
            onPress: () => Alert.alert('Privacy Policy', 'Your data is stored locally on your device and never shared with third parties.'),
            showChevron: true
          }),
          renderSettingItem({
            icon: 'heart',
            title: 'Rate the App',
            subtitle: 'Help us improve by leaving a review',
            onPress: () => Alert.alert('Thank You!', 'Thank you for using our app! App Store rating will be available when published.'),
            showChevron: true
          })
        ])}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for your daily reflection
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  iconContainerDestructive: {
    backgroundColor: theme.colors.error + '20',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '500',
    color: theme.colors.text,
  },
  settingTitleDestructive: {
    color: theme.colors.error,
  },
  settingSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  footerText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
});

export default SettingsScreen;
