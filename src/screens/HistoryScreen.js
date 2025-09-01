import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format, isSameDay } from 'date-fns';
import { globalStyles, theme } from '../styles';
import { useJournal } from '../context/JournalContext';
import { JournalService } from '../services/journalService';
import { Calendar, EntryPreview, CompactEntryPreview } from '../components/common';

const HistoryScreen = () => {
  const { selectedDate, changeDate } = useJournal();
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [recentEntries, setRecentEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load recent entries for list view
  const loadRecentEntries = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const entries = await JournalService.getAllEntries(30); // Last 30 entries
      setRecentEntries(entries);
    } catch (error) {
      console.error('Error loading recent entries:', error);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  // Load entry for selected date
  const loadEntryForDate = async (date) => {
    try {
      const entry = await JournalService.getEntry(date);
      setSelectedEntry(entry);
    } catch (error) {
      console.error('Error loading entry for date:', error);
      setSelectedEntry(null);
    }
  };

  useEffect(() => {
    loadRecentEntries();
  }, []);

  useEffect(() => {
    if (viewMode === 'calendar' && selectedDate) {
      loadEntryForDate(selectedDate);
    }
  }, [selectedDate, viewMode]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecentEntries(true);
  };

  const handleDateSelect = async (date) => {
    await changeDate(date);
  };

  const handleEntryPress = async (entry) => {
    const entryDate = new Date(entry.date + 'T00:00:00');
    await changeDate(entryDate);
    // Navigate to Today screen would happen here in a real app
    // For now, we'll just update the selected date
  };

  const renderViewToggle = () => (
    <View style={styles.viewToggle}>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          viewMode === 'calendar' && styles.toggleButtonActive
        ]}
        onPress={() => setViewMode('calendar')}
      >
        <Ionicons 
          name="calendar" 
          size={18} 
          color={viewMode === 'calendar' ? 'white' : theme.colors.primary} 
        />
        <Text style={[
          styles.toggleText,
          viewMode === 'calendar' && styles.toggleTextActive
        ]}>Calendar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.toggleButton,
          viewMode === 'list' && styles.toggleButtonActive
        ]}
        onPress={() => setViewMode('list')}
      >
        <Ionicons 
          name="list" 
          size={18} 
          color={viewMode === 'list' ? 'white' : theme.colors.primary} 
        />
        <Text style={[
          styles.toggleText,
          viewMode === 'list' && styles.toggleTextActive
        ]}>List</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCalendarView = () => (
    <View>
      <Calendar
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        highlightToday={true}
      />
      
      {selectedEntry && (
        <View style={styles.selectedEntryContainer}>
          <Text style={styles.sectionTitle}>Selected Entry</Text>
          <EntryPreview
            entry={selectedEntry}
            onPress={() => handleEntryPress(selectedEntry)}
          />
        </View>
      )}
      
      {!selectedEntry && selectedDate && (
        <View style={styles.noEntryContainer}>
          <Text style={styles.noEntryText}>
            No entry for {format(selectedDate, 'MMMM d, yyyy')}
          </Text>
          <TouchableOpacity 
            style={styles.createEntryButton}
            onPress={() => handleEntryPress({ date: format(selectedDate, 'yyyy-MM-dd') })}
          >
            <Text style={styles.createEntryButtonText}>Create Entry</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderListView = () => (
    <View>
      <Text style={styles.sectionTitle}>Recent Entries</Text>
      
      {recentEntries.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="journal-outline" size={48} color={theme.colors.textLight} />
          <Text style={styles.emptyStateText}>No entries yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Start journaling to see your entries here
          </Text>
        </View>
      ) : (
        <View>
          {recentEntries.map((entry) => (
            <CompactEntryPreview
              key={entry.date}
              entry={entry}
              onPress={() => handleEntryPress(entry)}
            />
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView 
        style={globalStyles.container}
        contentContainerStyle={globalStyles.paddingMd}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {renderViewToggle()}
        
        {viewMode === 'calendar' ? renderCalendarView() : renderListView()}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: 4,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    gap: theme.spacing.xs,
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  toggleText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  toggleTextActive: {
    color: 'white',
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  selectedEntryContainer: {
    marginTop: theme.spacing.lg,
  },
  noEntryContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  noEntryText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  createEntryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  createEntryButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing['3xl'],
  },
  emptyStateText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  emptyStateSubtext: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
});

export default HistoryScreen;
