import { getDatabase } from './database';
import { format } from 'date-fns';

export class JournalService {
  static async createEntry(date, goals, affirmations, gratitude) {
    try {
      const db = await getDatabase();
      const dateString = format(date, 'yyyy-MM-dd');
      
      const result = await db.runAsync(
        `INSERT OR REPLACE INTO journal_entries 
         (date, goals, affirmations, gratitude, goals_completed, updated_at) 
         VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          dateString,
          JSON.stringify(goals),
          JSON.stringify(affirmations),
          JSON.stringify(gratitude),
          this.countCompletedGoals(goals)
        ]
      );
      
      return { id: result.lastInsertRowId, date: dateString };
    } catch (error) {
      console.error('Error creating journal entry:', error);
      throw error;
    }
  }
  
  static async getEntry(date) {
    try {
      const db = await getDatabase();
      const dateString = format(date, 'yyyy-MM-dd');
      
      const result = await db.getFirstAsync(
        'SELECT * FROM journal_entries WHERE date = ?',
        [dateString]
      );
      
      if (result) {
        return {
          ...result,
          goals: JSON.parse(result.goals),
          affirmations: JSON.parse(result.affirmations),
          gratitude: JSON.parse(result.gratitude),
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting journal entry:', error);
      throw error;
    }
  }
  
  static async updateEntry(date, goals, affirmations, gratitude) {
    try {
      const db = await getDatabase();
      const dateString = format(date, 'yyyy-MM-dd');
      
      await db.runAsync(
        `UPDATE journal_entries 
         SET goals = ?, affirmations = ?, gratitude = ?, goals_completed = ?, updated_at = CURRENT_TIMESTAMP
         WHERE date = ?`,
        [
          JSON.stringify(goals),
          JSON.stringify(affirmations),
          JSON.stringify(gratitude),
          this.countCompletedGoals(goals),
          dateString
        ]
      );
      
      return true;
    } catch (error) {
      console.error('Error updating journal entry:', error);
      throw error;
    }
  }
  
  static async getEntriesByDateRange(startDate, endDate) {
    try {
      const db = await getDatabase();
      const startDateString = format(startDate, 'yyyy-MM-dd');
      const endDateString = format(endDate, 'yyyy-MM-dd');
      
      const results = await db.getAllAsync(
        `SELECT * FROM journal_entries 
         WHERE date >= ? AND date <= ? 
         ORDER BY date DESC`,
        [startDateString, endDateString]
      );
      
      return results.map(entry => ({
        ...entry,
        goals: JSON.parse(entry.goals),
        affirmations: JSON.parse(entry.affirmations),
        gratitude: JSON.parse(entry.gratitude),
      }));
    } catch (error) {
      console.error('Error getting entries by date range:', error);
      throw error;
    }
  }
  
  static async getAllEntries(limit = 50) {
    try {
      const db = await getDatabase();
      
      const results = await db.getAllAsync(
        'SELECT * FROM journal_entries ORDER BY date DESC LIMIT ?',
        [limit]
      );
      
      return results.map(entry => ({
        ...entry,
        goals: JSON.parse(entry.goals),
        affirmations: JSON.parse(entry.affirmations),
        gratitude: JSON.parse(entry.gratitude),
      }));
    } catch (error) {
      console.error('Error getting all entries:', error);
      throw error;
    }
  }
  
  static async deleteEntry(date) {
    try {
      const db = await getDatabase();
      const dateString = format(date, 'yyyy-MM-dd');
      
      await db.runAsync('DELETE FROM journal_entries WHERE date = ?', [dateString]);
      return true;
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      throw error;
    }
  }
  
  // Helper method to count completed goals
  static countCompletedGoals(goals) {
    if (!Array.isArray(goals)) return 0;
    return goals.filter(goal => goal.completed).length;
  }
}
