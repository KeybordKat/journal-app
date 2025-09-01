import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, addDays, startOfWeek, endOfWeek, isSameDay, isToday, isSameMonth } from 'date-fns';
import { theme } from '../../styles/theme';

const DatePicker = ({ visible, onClose, selectedDate, onDateSelect, title = "Select Date" }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    handleDateSelect(today);
  };

  const handleDateSelect = (date) => {
    if (onDateSelect) {
      onDateSelect(date);
    }
    onClose();
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.monthNavigation}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <Ionicons name="chevron-back" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        
        <View style={styles.monthTitle}>
          <Text style={styles.monthText}>
            {format(currentMonth, 'MMMM yyyy')}
          </Text>
        </View>
        
        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
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

  const renderCalendar = () => {
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
              isTodayDate && !isSelected && styles.dayContainerToday,
            ]}
            onPress={() => isCurrentMonth && handleDateSelect(cloneDay)}
            disabled={!isCurrentMonth}
          >
            <Text
              style={[
                styles.dayText,
                !isCurrentMonth && styles.dayTextOutsideMonth,
                isSelected && styles.dayTextSelected,
                isTodayDate && !isSelected && styles.dayTextToday,
              ]}
            >
              {format(day, 'd')}
            </Text>
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

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <TouchableOpacity 
        onPress={goToToday} 
        style={[styles.quickActionButton, styles.todayButton]}
      >
        <Ionicons name="today" size={18} color="white" />
        <Text style={styles.todayButtonText}>Today</Text>
      </TouchableOpacity>
      
      <View style={styles.selectedDateDisplay}>
        <Text style={styles.selectedDateText}>
          {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'No date selected'}
        </Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {renderHeader()}
          {renderWeekDays()}
          {renderCalendar()}
          {renderQuickActions()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: 350,
    maxHeight: '80%',
    ...theme.shadows.lg,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  monthTitle: {
    flex: 1,
    alignItems: 'center',
  },
  monthText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
    color: theme.colors.text,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
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
    marginBottom: theme.spacing.md,
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayContainer: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    borderRadius: theme.borderRadius.md,
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
  quickActions: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  todayButton: {
    backgroundColor: theme.colors.primary,
  },
  todayButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
  },
  selectedDateDisplay: {
    flex: 1,
    alignItems: 'flex-end',
  },
  selectedDateText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});

export default DatePicker;
