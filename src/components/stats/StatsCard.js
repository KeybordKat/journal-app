import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

const StatsCard = ({
  title,
  value,
  subtitle,
  icon,
  color = theme.colors.primary,
  backgroundColor = theme.colors.surface,
  isPercentage = false,
  trend, // 'up', 'down', 'neutral', or null
  loading = false,
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <Ionicons name="trending-up" size={16} color={theme.colors.success} />;
      case 'down':
        return <Ionicons name="trending-down" size={16} color={theme.colors.error} />;
      case 'neutral':
        return <Ionicons name="remove" size={16} color={theme.colors.textLight} />;
      default:
        return null;
    }
  };

  const formatValue = (val) => {
    if (loading) return '...';
    if (val === null || val === undefined) return '0';
    
    if (isPercentage) {
      return `${val}%`;
    }
    
    // Format large numbers with commas
    if (typeof val === 'number' && val >= 1000) {
      return val.toLocaleString();
    }
    
    return val.toString();
  };

  return (
    <View style={[styles.card, { backgroundColor }, theme.shadows.sm]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {icon && (
            <Ionicons 
              name={icon} 
              size={18} 
              color={color} 
              style={styles.icon}
            />
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
        
        {getTrendIcon()}
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.value, { color }]}>
          {formatValue(value)}
        </Text>
        
        {subtitle && (
          <Text style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
};

// Specialized card for streaks with flame emoji styling
export const StreakCard = ({ currentStreak, longestStreak, loading = false }) => (
  <View style={[styles.card, styles.streakCard, theme.shadows.sm]}>
    <View style={styles.streakHeader}>
      <Text style={styles.streakEmoji}>🔥</Text>
      <Text style={styles.title}>Streak</Text>
    </View>
    
    <View style={styles.streakContent}>
      <View style={styles.streakRow}>
        <Text style={styles.streakLabel}>Current</Text>
        <Text style={[styles.streakValue, { color: theme.colors.primary }]}>
          {loading ? '...' : currentStreak} {currentStreak === 1 ? 'day' : 'days'}
        </Text>
      </View>
      
      <View style={styles.streakDivider} />
      
      <View style={styles.streakRow}>
        <Text style={styles.streakLabel}>Best</Text>
        <Text style={styles.streakValue}>
          {loading ? '...' : longestStreak} {longestStreak === 1 ? 'day' : 'days'}
        </Text>
      </View>
    </View>
  </View>
);

// Specialized card for completion rate with circular progress
export const CompletionRateCard = ({ rate, label = "Overall", color = theme.colors.primary, loading = false }) => (
  <View style={[styles.card, styles.completionCard, theme.shadows.sm]}>
    <View style={styles.completionHeader}>
      <Text style={styles.title}>{label}</Text>
      <Text style={styles.completionSubtitle}>Completion Rate</Text>
    </View>
    
    <View style={styles.completionContent}>
      <View style={[styles.progressCircle, { borderColor: color + '20' }]}>
        <View 
          style={[
            styles.progressFill, 
            { 
              borderColor: color,
              transform: [{ rotate: `${(loading ? 0 : rate || 0) * 3.6}deg` }]
            }
          ]} 
        />
        <View style={styles.progressCenter}>
          <Text style={[styles.progressText, { color }]}>
            {loading ? '...' : `${rate || 0}%`}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    alignItems: 'flex-start',
  },
  value: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  
  // Streak Card Styles
  streakCard: {
    backgroundColor: '#FFF8E1', // Light warm background
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  streakEmoji: {
    fontSize: 24,
    marginRight: theme.spacing.sm,
  },
  streakContent: {
    gap: theme.spacing.sm,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakLabel: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
  },
  streakValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
  },
  streakDivider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: theme.spacing.xs,
  },
  
  // Completion Card Styles
  completionCard: {
    alignItems: 'center',
  },
  completionHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  completionSubtitle: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  completionContent: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: theme.colors.primary,
    top: -2,
    left: -2,
  },
  progressCenter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: 'bold',
  },
});

export default StatsCard;
