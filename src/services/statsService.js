import { getDatabase } from './database';
import { format, subDays, subWeeks, subMonths, subYears, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

export class StatsService {
  static async getWeeklyStats(date = new Date()) {
    try {
      const startDate = startOfWeek(date, { weekStartsOn: 1 }); // Monday
      const endDate = endOfWeek(date, { weekStartsOn: 1 }); // Sunday
      
      const entries = await this.getEntriesInRange(startDate, endDate);
      
      return {
        totalEntries: entries.length,
        totalGoalsCompleted: this.sumGoalsCompleted(entries),
        totalGoalsSet: this.sumGoalsSet(entries),
        completionRate: this.calculateCompletionRate(entries),
        daysWithEntries: entries.length,
        streak: await this.calculateStreak(date),
      };
    } catch (error) {
      console.error('Error getting weekly stats:', error);
      throw error;
    }
  }
  
  static async getMonthlyStats(date = new Date()) {
    try {
      const startDate = startOfMonth(date);
      const endDate = endOfMonth(date);
      
      const entries = await this.getEntriesInRange(startDate, endDate);
      
      return {
        totalEntries: entries.length,
        totalGoalsCompleted: this.sumGoalsCompleted(entries),
        totalGoalsSet: this.sumGoalsSet(entries),
        completionRate: this.calculateCompletionRate(entries),
        daysWithEntries: entries.length,
        averageGoalsPerDay: this.calculateAverageGoalsPerDay(entries),
      };
    } catch (error) {
      console.error('Error getting monthly stats:', error);
      throw error;
    }
  }
  
  static async getYearlyStats(date = new Date()) {
    try {
      const startDate = startOfYear(date);
      const endDate = endOfYear(date);
      
      const entries = await this.getEntriesInRange(startDate, endDate);
      
      return {
        totalEntries: entries.length,
        totalGoalsCompleted: this.sumGoalsCompleted(entries),
        totalGoalsSet: this.sumGoalsSet(entries),
        completionRate: this.calculateCompletionRate(entries),
        daysWithEntries: entries.length,
        averageGoalsPerDay: this.calculateAverageGoalsPerDay(entries),
        monthlyBreakdown: await this.getMonthlyBreakdown(date),
      };
    } catch (error) {
      console.error('Error getting yearly stats:', error);
      throw error;
    }
  }
  
  static async calculateStreak(endDate = new Date()) {
    try {
      const db = await getDatabase();
      let currentDate = new Date(endDate);
      let streak = 0;
      
      // Check backwards from endDate to find consecutive days with entries
      while (true) {
        const dateString = format(currentDate, 'yyyy-MM-dd');
        
        const result = await db.getFirstAsync(
          'SELECT id FROM journal_entries WHERE date = ?',
          [dateString]
        );
        
        if (result) {
          streak++;
          currentDate = subDays(currentDate, 1);
        } else {
          break;
        }
        
        // Prevent infinite loop (max 365 days)
        if (streak >= 365) break;
      }
      
      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  }
  
  static async getEntriesInRange(startDate, endDate) {
    try {
      const db = await getDatabase();
      const startDateString = format(startDate, 'yyyy-MM-dd');
      const endDateString = format(endDate, 'yyyy-MM-dd');
      
      const results = await db.getAllAsync(
        `SELECT goals, goals_completed FROM journal_entries 
         WHERE date >= ? AND date <= ? 
         ORDER BY date DESC`,
        [startDateString, endDateString]
      );
      
      return results.map(entry => ({
        ...entry,
        goals: JSON.parse(entry.goals),
      }));
    } catch (error) {
      console.error('Error getting entries in range:', error);
      return [];
    }
  }
  
  static sumGoalsCompleted(entries) {
    return entries.reduce((sum, entry) => sum + entry.goals_completed, 0);
  }
  
  static sumGoalsSet(entries) {
    return entries.reduce((sum, entry) => {
      const goals = Array.isArray(entry.goals) ? entry.goals : [];
      return sum + goals.length;
    }, 0);
  }
  
  static calculateCompletionRate(entries) {
    const totalGoalsSet = this.sumGoalsSet(entries);
    const totalGoalsCompleted = this.sumGoalsCompleted(entries);
    
    if (totalGoalsSet === 0) return 0;
    return Math.round((totalGoalsCompleted / totalGoalsSet) * 100);
  }
  
  static calculateAverageGoalsPerDay(entries) {
    if (entries.length === 0) return 0;
    const totalGoals = this.sumGoalsSet(entries);
    return Math.round((totalGoals / entries.length) * 10) / 10; // Round to 1 decimal place
  }
  
  static async getMonthlyBreakdown(year = new Date().getFullYear()) {
    try {
      const breakdown = [];
      
      for (let month = 0; month < 12; month++) {
        const date = new Date(year, month, 1);
        const startDate = startOfMonth(date);
        const endDate = endOfMonth(date);
        
        const entries = await this.getEntriesInRange(startDate, endDate);
        
        breakdown.push({
          month: month + 1,
          monthName: format(date, 'MMMM'),
          totalEntries: entries.length,
          totalGoalsCompleted: this.sumGoalsCompleted(entries),
          completionRate: this.calculateCompletionRate(entries),
        });
      }
      
      return breakdown;
    } catch (error) {
      console.error('Error getting monthly breakdown:', error);
      return [];
    }
  }
}
