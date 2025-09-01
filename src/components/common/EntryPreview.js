import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { theme } from '../../styles/theme';

const EntryPreview = ({ entry, onPress }) => {
  if (!entry) return null;

  const getGoalsStats = () => {
    if (!entry.goals || !Array.isArray(entry.goals)) return { completed: 0, total: 0 };
    const completed = entry.goals.filter(goal => goal.completed).length;
    return { completed, total: entry.goals.length };
  };

  const getContentPreview = (items, maxLength = 50) => {
    if (!items || !Array.isArray(items)) return '';
    const nonEmpty = items.filter(item => item && item.trim() !== '');
    if (nonEmpty.length === 0) return '';
    
    const preview = nonEmpty[0];
    return preview.length > maxLength ? preview.substring(0, maxLength) + '...' : preview;
  };

  const hasContent = (items) => {
    if (!items || !Array.isArray(items)) return false;
    return items.some(item => item && item.trim() !== '');
  };

  const goalsStats = getGoalsStats();
  const affirmationsPreview = getContentPreview(entry.affirmations);
  const gratitudePreview = getContentPreview(entry.gratitude);
  const hasAffirmations = hasContent(entry.affirmations);
  const hasGratitude = hasContent(entry.gratitude);

  const entryDate = new Date(entry.date + 'T00:00:00');

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.dateText}>
          {format(entryDate, 'EEEE, MMM d')}
        </Text>
        <View style={styles.completionBadge}>
          <Text style={styles.completionText}>
            {goalsStats.completed}/{goalsStats.total}
          </Text>
        </View>
      </View>

      {/* Goals Summary */}
      {goalsStats.total > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkbox" size={14} color={theme.colors.goals} />
            <Text style={styles.sectionTitle}>Goals</Text>
          </View>
          <View style={styles.goalsProgress}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(goalsStats.completed / goalsStats.total) * 100}%`,
                    backgroundColor: theme.colors.goals
                  }
                ]} 
              />
            </View>
            <Text style={styles.goalsText}>
              {goalsStats.completed} of {goalsStats.total} completed
            </Text>
          </View>
        </View>
      )}

      {/* Affirmations Preview */}
      {hasAffirmations && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="sparkles" size={14} color={theme.colors.affirmations} />
            <Text style={styles.sectionTitle}>Affirmations</Text>
          </View>
          <Text style={styles.contentPreview} numberOfLines={2}>
            {affirmationsPreview}
          </Text>
        </View>
      )}

      {/* Gratitude Preview */}
      {hasGratitude && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="heart" size={14} color={theme.colors.gratitude} />
            <Text style={styles.sectionTitle}>Gratitude</Text>
          </View>
          <Text style={styles.contentPreview} numberOfLines={2}>
            {gratitudePreview}
          </Text>
        </View>
      )}

      {/* Empty state */}
      {goalsStats.total === 0 && !hasAffirmations && !hasGratitude && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Tap to add your first entry</Text>
        </View>
      )}

      {/* Footer indicator */}
      <View style={styles.footer}>
        <Ionicons name="chevron-forward" size={16} color={theme.colors.textLight} />
      </View>
    </TouchableOpacity>
  );
};

// Compact version for list views
export const CompactEntryPreview = ({ entry, onPress }) => {
  if (!entry) return null;

  const goalsStats = entry.goals ? {
    completed: entry.goals.filter(goal => goal.completed).length,
    total: entry.goals.length
  } : { completed: 0, total: 0 };

  const hasAffirmations = entry.affirmations?.some(item => item?.trim() !== '');
  const hasGratitude = entry.gratitude?.some(item => item?.trim() !== '');

  const entryDate = new Date(entry.date + 'T00:00:00');

  return (
    <TouchableOpacity 
      style={styles.compactContainer} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.compactLeft}>
        <Text style={styles.compactDate}>
          {format(entryDate, 'MMM d')}
        </Text>
        <Text style={styles.compactDay}>
          {format(entryDate, 'EEE')}
        </Text>
      </View>

      <View style={styles.compactCenter}>
        <View style={styles.compactStats}>
          {goalsStats.total > 0 && (
            <View style={styles.compactStatItem}>
              <Ionicons name="checkbox" size={12} color={theme.colors.goals} />
              <Text style={styles.compactStatText}>
                {goalsStats.completed}/{goalsStats.total}
              </Text>
            </View>
          )}
          
          {hasAffirmations && (
            <View style={styles.compactIndicator}>
              <Ionicons name="sparkles" size={12} color={theme.colors.affirmations} />
            </View>
          )}
          
          {hasGratitude && (
            <View style={styles.compactIndicator}>
              <Ionicons name="heart" size={12} color={theme.colors.gratitude} />
            </View>
          )}
        </View>
      </View>

      <View style={styles.compactRight}>
        <Ionicons name="chevron-forward" size={14} color={theme.colors.textLight} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  dateText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
  },
  completionBadge: {
    backgroundColor: theme.colors.goals + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  completionText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.goals,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  goalsProgress: {
    gap: theme.spacing.xs,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalsText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  contentPreview: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    fontStyle: 'italic',
  },
  footer: {
    alignItems: 'flex-end',
    marginTop: theme.spacing.xs,
  },

  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  compactLeft: {
    alignItems: 'center',
    marginRight: theme.spacing.md,
    minWidth: 50,
  },
  compactDate: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
    color: theme.colors.text,
  },
  compactDay: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
  },
  compactCenter: {
    flex: 1,
  },
  compactStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  compactStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  compactStatText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  compactIndicator: {
    opacity: 0.8,
  },
  compactRight: {
    marginLeft: theme.spacing.md,
  },
});

export default EntryPreview;
