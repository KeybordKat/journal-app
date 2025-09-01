import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameDay, isSameMonth, isToday } from 'date-fns';
import { theme } from '../../styles/theme';
import { JournalService } from '../../services/journalService';

const Calendar = ({ selectedDate, onDateSelect, highlightToday = true }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const [datesWithEntries, setDatesWithEntries] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Load which dates have entries for the current month
  const loadEntriesForMonth = async (month) => {
    setLoading(true);
    try {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const entries = await JournalService.getEntriesByDateRange(monthStart, monthEnd);
      
      const entryDates = new Set(entries.map(entry => entry.date));
      setDatesWithEntries(entryDates);
    } catch (error) {
      console.error('Error loading entries for month:', error);
      setDatesWithEntries(new Set());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntriesForMonth(currentMonth);
  }, [currentMonth]);

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToCurrentMonth = () => {
    const now = new Date();
    setCurrentMonth(now);
  };

  const renderCalendarHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
        <Ionicons name="chevron-back" size={20} color={theme.colors.primary} />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={goToCurrentMonth} style={styles.monthButton}>
        <Text style={styles.monthText}>
          {format(currentMonth, 'MMMM yyyy')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderWeekDays = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <View style={styles.weekDaysRow}>
        {weekDays.map(day => (
          <View key={day} style={styles.weekDayContainer}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dateString = format(cloneDay, 'yyyy-MM-dd');
        const hasEntry = datesWithEntries.has(dateString);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isTodayDate = isToday(day);

        days.push(
          <TouchableOpacity
            key={day}
            style={[
              styles.dayContainer,
              !isCurrentMonth && styles.dayContainerOutsideMonth,
              isSelected && styles.dayContainerSelected,
              isTodayDate && highlightToday && !isSelected && styles.dayContainerToday,
            ]}
            onPress={() => onDateSelect && onDateSelect(cloneDay)}
            disabled={!isCurrentMonth}
          >
            <Text
              style={[
                styles.dayText,
                !isCurrentMonth && styles.dayTextOutsideMonth,
                isSelected && styles.dayTextSelected,
                isTodayDate && highlightToday && !isSelected && styles.dayTextToday,
              ]}
            >
              {format(day, 'd')}
            </Text>
            
            {hasEntry && isCurrentMonth && (
              <View 
                style={[
                  styles.entryIndicator,
                  isSelected && styles.entryIndicatorSelected
                ]} 
              />
            )}
          </TouchableOpacity>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <View key={day} style={styles.weekRow}>
          {days}
        </View>
      );
      days = [];
    }

    return <View style={styles.calendarGrid}>{rows}</View>;
  };

  return (
    <View style={styles.container}>
      {renderCalendarHeader()}
      {renderWeekDays()}
      {renderCalendarDays()}
      
      {highlightToday && (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={styles.legendDot} />
            <Text style={styles.legendText}>Has entry</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSquare, { backgroundColor: theme.colors.primary + '20' }]} />
            <Text style={styles.legendText}>Today</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  navButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  monthButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  monthText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  weekDayContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  weekDayText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  calendarGrid: {
    marginBottom: theme.spacing.sm,
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayContainer: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 1,
    borderRadius: theme.borderRadius.sm,
    position: 'relative',
  },
  dayContainerOutsideMonth: {
    opacity: 0.3,
  },
  dayContainerSelected: {
    backgroundColor: theme.colors.primary,
  },
  dayContainerToday: {
    backgroundColor: theme.colors.primary + '20',
  },
  dayText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
  },
  dayTextOutsideMonth: {
    color: theme.colors.textLight,
  },
  dayTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  dayTextToday: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  entryIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.success,
  },
  entryIndicatorSelected: {
    backgroundColor: 'white',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.success,
  },
  legendSquare: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  legendText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
  },
});

export default Calendar;
