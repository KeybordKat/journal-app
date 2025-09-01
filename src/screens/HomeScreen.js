import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { useJournal } from '../context/JournalContext';
import GoalsSection from '../components/journal/GoalsSection';
import TextSection from '../components/journal/TextSection';
import { globalStyles, theme } from '../styles';

const HomeScreen = () => {
  const { 
    currentEntry, 
    selectedDate, 
    isLoading, 
    hasUnsavedChanges,
    updateGoals, 
    toggleGoalCompletion,
    saveEntry 
  } = useJournal();

  const handleSave = async () => {
    const success = await saveEntry();
    if (success) {
      Alert.alert('Success', 'Your journal entry has been saved!');
    } else {
      Alert.alert('Error', 'Failed to save your entry. Please try again.');
    }
  };

  const updateAffirmations = (affirmations) => {
    // For now, we'll just implement goals. We can add affirmations and gratitude later.
  };

  const updateGratitude = (gratitude) => {
    // For now, we'll just implement goals. We can add affirmations and gratitude later.
  };

  if (!currentEntry) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <View style={[globalStyles.container, globalStyles.centered]}>
          <Text style={globalStyles.bodyText}>Loading your journal...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView 
        style={globalStyles.container}
        contentContainerStyle={globalStyles.paddingMd}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Header */}
        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </Text>
          {hasUnsavedChanges && (
            <View style={styles.unsavedIndicator}>
              <Text style={styles.unsavedText}>•</Text>
            </View>
          )}
        </View>

        {/* Goals Section */}
        <GoalsSection
          goals={currentEntry.goals || []}
          onUpdateGoals={updateGoals}
          onToggleGoalCompletion={toggleGoalCompletion}
        />

        {/* Affirmations Section - Placeholder for now */}
        <View style={styles.placeholder}>
          <Text style={globalStyles.cardTitle}>Daily Affirmations</Text>
          <Text style={globalStyles.secondaryText}>Coming soon...</Text>
        </View>

        {/* Gratitude Section - Placeholder for now */}
        <View style={styles.placeholder}>
          <Text style={globalStyles.cardTitle}>Gratitude</Text>
          <Text style={globalStyles.secondaryText}>Coming soon...</Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            globalStyles.button,
            styles.saveButton,
            !hasUnsavedChanges && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={!hasUnsavedChanges || isLoading}
        >
          <Text style={[
            globalStyles.buttonText,
            !hasUnsavedChanges && styles.saveButtonTextDisabled
          ]}>
            {isLoading ? 'Saving...' : hasUnsavedChanges ? 'Save Entry' : 'Saved'}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  dateText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  unsavedIndicator: {
    marginLeft: theme.spacing.sm,
  },
  unsavedText: {
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  placeholder: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  saveButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  saveButtonDisabled: {
    backgroundColor: theme.colors.textLight,
  },
  saveButtonTextDisabled: {
    color: theme.colors.surface,
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
});

export default HomeScreen;
