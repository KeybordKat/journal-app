import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles, theme } from '../styles';
import { StatsService } from '../services/statsService';
import { 
  StatsCard, 
  StreakCard, 
  CompletionRateCard,
  TrendChart,
  SectionBreakdown,
  WeeklyOverview 
} from '../components/stats';

const StatsScreen = () => {
  const [stats, setStats] = useState(null);
  const [sectionStats, setSectionStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      
      const [dashboardStats, sectionCompletionStats] = await Promise.all([
        StatsService.getDashboardStats(),
        StatsService.getSectionCompletionStats()
      ]);
      
      setStats(dashboardStats);
      setSectionStats(sectionCompletionStats);
    } catch (error) {
      console.error('Error loading stats:', error);
      Alert.alert('Error', 'Failed to load statistics. Please try again.');
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats(true);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const renderOverviewSection = () => {
    if (!stats) return null;
    
    return (
      <View style={{ marginBottom: theme.spacing.lg }}>
        <Text style={[globalStyles.subtitle, { marginBottom: theme.spacing.md, textAlign: 'center' }]}>
          Overview
        </Text>
        
        <View style={{ flexDirection: 'row', marginBottom: theme.spacing.md }}>
          <View style={{ flex: 1, marginRight: theme.spacing.sm }}>
            <StatsCard
              title="Total Entries"
              value={stats.overview.totalEntries}
              icon="journal"
              color={theme.colors.primary}
              subtitle="journal entries"
              loading={loading}
            />
          </View>
          
          <View style={{ flex: 1, marginLeft: theme.spacing.sm }}>
            <StatsCard
              title="Goals Completed"
              value={stats.overview.totalGoalsCompleted}
              icon="checkmark-circle"
              color={theme.colors.goals}
              subtitle="total goals"
              loading={loading}
            />
          </View>
        </View>
        
        <StreakCard
          currentStreak={stats.current.streak}
          longestStreak={stats.overview.longestStreak}
          loading={loading}
        />
      </View>
    );
  };

  const renderCompletionSection = () => {
    if (!stats) return null;
    
    return (
      <View style={{ marginBottom: theme.spacing.lg }}>
        <Text style={[globalStyles.subtitle, { marginBottom: theme.spacing.md, textAlign: 'center' }]}>
          Completion Rates
        </Text>
        
        <View style={{ flexDirection: 'row', marginBottom: theme.spacing.md }}>
          <View style={{ flex: 1, marginRight: theme.spacing.xs }}>
            <CompletionRateCard
              rate={stats.current.weeklyCompletionRate}
              label="This Week"
              color={theme.colors.primary}
              loading={loading}
            />
          </View>
          
          <View style={{ flex: 1, marginHorizontal: theme.spacing.xs }}>
            <CompletionRateCard
              rate={stats.current.monthlyCompletionRate}
              label="This Month"
              color={theme.colors.goals}
              loading={loading}
            />
          </View>
          
          <View style={{ flex: 1, marginLeft: theme.spacing.xs }}>
            <CompletionRateCard
              rate={stats.overview.averageCompletionRate}
              label="Overall"
              color={theme.colors.success}
              loading={loading}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderTrendsSection = () => {
    if (!stats || !stats.trends) return null;
    
    return (
      <View style={{ marginBottom: theme.spacing.lg }}>
        <Text style={[globalStyles.subtitle, { marginBottom: theme.spacing.md, textAlign: 'center' }]}>
          Recent Trends
        </Text>
        
        <WeeklyOverview 
          data={stats.trends}
          title="Last 7 Days"
        />
        
        <TrendChart 
          data={stats.trends}
          title="Goal Completion Rate"
          height={120}
        />
      </View>
    );
  };

  const renderSectionBreakdown = () => {
    if (!sectionStats) return null;
    
    return (
      <View style={{ marginBottom: theme.spacing.lg }}>
        <SectionBreakdown 
          data={sectionStats}
          loading={loading}
        />
      </View>
    );
  };

  const renderThisWeekSection = () => {
    if (!stats || !stats.recent) return null;
    
    return (
      <View style={{ marginBottom: theme.spacing.lg }}>
        <Text style={[globalStyles.subtitle, { marginBottom: theme.spacing.md, textAlign: 'center' }]}>
          Recent Activity
        </Text>
        
        <View style={{ flexDirection: 'row', marginBottom: theme.spacing.md }}>
          <View style={{ flex: 1, marginRight: theme.spacing.sm }}>
            <StatsCard
              title="This Week"
              value={stats.recent.thisWeek.entries}
              icon="calendar"
              color={theme.colors.primary}
              subtitle={`${stats.recent.thisWeek.goalsCompleted} goals completed`}
              loading={loading}
            />
          </View>
          
          <View style={{ flex: 1, marginLeft: theme.spacing.sm }}>
            <StatsCard
              title="This Month"
              value={stats.recent.thisMonth.entries}
              icon="stats-chart"
              color={theme.colors.goals}
              subtitle={`${stats.recent.thisMonth.goalsCompleted} goals completed`}
              loading={loading}
            />
          </View>
        </View>
      </View>
    );
  };

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
        {renderOverviewSection()}
        {renderCompletionSection()}
        {renderSectionBreakdown()}
        {renderTrendsSection()}
        {renderThisWeekSection()}
        
        <View style={{ height: theme.spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default StatsScreen;
