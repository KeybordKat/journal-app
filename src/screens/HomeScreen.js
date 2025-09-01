import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Alert, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format, isToday } from 'date-fns';
import { useJournal } from '../context/JournalContext';
import GoalsSection from '../components/journal/GoalsSection';
import TextInputSection from '../components/journal/TextInputSection';
import { DatePicker } from '../components/common';
import { globalStyles, theme } from '../styles';

const HomeScreen = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const { 
    currentEntry, 
    selectedDate, 
    isLoading, 
    hasUnsavedChanges,
    updateGoals, 
    toggleGoalCompletion,
    updateAffirmations,
    updateGratitude,
    saveEntry,
    changeToPreviousDay,
    changeToNextDay,
    goToToday,
    changeDate
  } = useJournal();

  const handleSave = async () => {
    const success = await saveEntry();
    if (success) {
      Alert.alert('Success', 'Your journal entry has been saved!');
    } else {
      Alert.alert('Error', 'Failed to save your entry. Please try again.');
    }
  };

  const handleDatePickerSelect = async (date) => {
    await changeDate(date);
    setShowDatePicker(false);
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
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={Keyboard.dismiss}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
        {/* Date Header */}
        <View style={styles.dateHeader}>
          <TouchableOpacity 
            onPress={changeToPreviousDay}
            style={styles.navButton}
          >
            <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          
          <View style={styles.dateContainer}>
            <TouchableOpacity 
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
            >
              <Text style={styles.dateText}>
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </Text>
              <Text style={styles.dateHint}>Tap to change date</Text>
              <Ionicons 
                name="calendar-outline" 
                size={16} 
                color={theme.colors.primary} 
                style={styles.calendarIcon}
              />
            </TouchableOpacity>
            {hasUnsavedChanges && (
              <View style={styles.unsavedIndicator}>
                <Text style={styles.unsavedText}>•</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            onPress={changeToNextDay}
            style={styles.navButton}
          >
            <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Goals Section */}
        <GoalsSection
          goals={currentEntry.goals || []}
          onUpdateGoals={updateGoals}
          onToggleGoalCompletion={toggleGoalCompletion}
        />

        {/* Affirmations Section */}
        <TextInputSection
          title="Daily Affirmations"
          items={currentEntry.affirmations || ['', '', '']}
          onUpdateItems={updateAffirmations}
          placeholder="Write a positive affirmation..."
          color={theme.colors.affirmations}
          icon="sparkles"
          numInputs={3}
        />

        {/* Gratitude Section */}
        <TextInputSection
          title="Gratitude"
          items={currentEntry.gratitude || ['', '', '']}
          onUpdateItems={updateGratitude}
          placeholder="Something you're grateful for..."
          color={theme.colors.gratitude}
          icon="heart"
          numInputs={3}
        />

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
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      
      <DatePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        selectedDate={selectedDate}
        onDateSelect={handleDatePickerSelect}
        title="Select Date"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  navButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  dateButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  dateText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  dateHint: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  calendarIcon: {
    marginTop: theme.spacing.xs,
  },
  todayHint: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  unsavedIndicator: {
    marginLeft: theme.spacing.sm,
  },
  unsavedText: {
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.primary,
    fontWeight: 'bold',
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
