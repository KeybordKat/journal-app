import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

// Simple bar chart for showing trends over days
export const TrendChart = ({ data, title, height = 120 }) => {
  const maxValue = Math.max(...data.map(item => item.completionRate || 0), 1);
  
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      
      <View style={[styles.chart, { height }]}>
        <View style={styles.barsContainer}>
          {data.map((item, index) => {
            const barHeight = (item.completionRate || 0) / maxValue * (height - 40);
            
            return (
              <View key={index} style={styles.barGroup}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: barHeight || 2,
                      backgroundColor: item.hasEntry 
                        ? theme.colors.primary 
                        : theme.colors.textLight + '40'
                    }
                  ]} 
                />
                <Text style={styles.barLabel}>{item.dayName}</Text>
              </View>
            );
          })}
        </View>
        
        <View style={styles.yAxis}>
          <Text style={styles.axisLabel}>{maxValue}%</Text>
          <Text style={styles.axisLabel}>{Math.round(maxValue / 2)}%</Text>
          <Text style={styles.axisLabel}>0%</Text>
        </View>
      </View>
    </View>
  );
};

// Horizontal progress bar for showing completion rates
export const ProgressBar = ({ 
  value = 0, 
  maxValue = 100, 
  color = theme.colors.primary,
  backgroundColor = theme.colors.border,
  height = 8,
  showLabel = true,
  label
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  return (
    <View style={styles.progressContainer}>
      {showLabel && (
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>{label}</Text>
          <Text style={styles.progressValue}>{Math.round(percentage)}%</Text>
        </View>
      )}
      
      <View style={[styles.progressTrack, { backgroundColor, height }]}>
        <View 
          style={[
            styles.progressFill, 
            { 
              backgroundColor: color, 
              width: `${percentage}%`,
              height
            }
          ]} 
        />
      </View>
    </View>
  );
};

// Section breakdown showing completion rates for goals, affirmations, gratitude
export const SectionBreakdown = ({ data, loading = false }) => {
  const sections = [
    {
      key: 'goals',
      label: 'Goals',
      color: theme.colors.goals,
      icon: '🎯'
    },
    {
      key: 'affirmations',
      label: 'Affirmations',
      color: theme.colors.affirmations,
      icon: '✨'
    },
    {
      key: 'gratitude',
      label: 'Gratitude',
      color: theme.colors.gratitude,
      icon: '🙏'
    }
  ];

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Section Completion</Text>
      
      <View style={styles.sectionsGrid}>
        {sections.map(section => {
          const sectionData = data[section.key] || { completionRate: 0, completedEntries: 0 };
          
          return (
            <View key={section.key} style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>{section.icon}</Text>
                <Text style={styles.sectionLabel}>{section.label}</Text>
              </View>
              
              <Text style={[styles.sectionRate, { color: section.color }]}>
                {loading ? '...' : `${sectionData.completionRate}%`}
              </Text>
              
              <Text style={styles.sectionSubtitle}>
                {loading ? '...' : `${sectionData.completedEntries}`} entries
              </Text>
              
              <ProgressBar
                value={sectionData.completionRate}
                color={section.color}
                height={6}
                showLabel={false}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

// Simple weekly overview with dots for each day
export const WeeklyOverview = ({ data, title = "This Week" }) => {
  return (
    <View style={styles.weeklyContainer}>
      <Text style={styles.weeklyTitle}>{title}</Text>
      
      <View style={styles.weeklyDots}>
        {data.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            <View 
              style={[
                styles.dayDot, 
                {
                  backgroundColor: day.hasEntry 
                    ? theme.colors.success 
                    : theme.colors.border
                }
              ]} 
            />
            <Text style={styles.dayLabel}>{day.dayName}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Trend Chart Styles
  chartContainer: {
    marginBottom: theme.spacing.lg,
  },
  chartTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.sm,
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 20,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    borderRadius: 2,
    marginBottom: theme.spacing.xs,
  },
  barLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
  },
  yAxis: {
    justifyContent: 'space-between',
    marginLeft: theme.spacing.sm,
    paddingBottom: 20,
  },
  axisLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
  },
  
  // Progress Bar Styles
  progressContainer: {
    marginBottom: theme.spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  progressLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    fontWeight: '500',
  },
  progressValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  progressTrack: {
    borderRadius: 4,
  },
  progressFill: {
    borderRadius: 4,
  },
  
  // Section Breakdown Styles
  sectionContainer: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  sectionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  sectionCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  sectionIcon: {
    fontSize: 20,
    marginBottom: theme.spacing.xs,
  },
  sectionLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  sectionRate: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.sm,
  },
  
  // Weekly Overview Styles
  weeklyContainer: {
    marginBottom: theme.spacing.lg,
  },
  weeklyTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  weeklyDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: theme.spacing.xs,
  },
  dayLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
  },
});

export default {
  TrendChart,
  ProgressBar,
  SectionBreakdown,
  WeeklyOverview,
};
