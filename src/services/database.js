import * as SQLite from 'expo-sqlite';

const DB_NAME = 'journal.db';

// Initialize database
export const initDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    
    // Create journal_entries table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS journal_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT UNIQUE NOT NULL,
        goals TEXT NOT NULL,
        affirmations TEXT NOT NULL,
        gratitude TEXT NOT NULL,
        goals_completed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create index on date for faster queries
    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_journal_entries_date 
      ON journal_entries (date);
    `);
    
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Get database instance
export const getDatabase = async () => {
  try {
    return await SQLite.openDatabaseAsync(DB_NAME);
  } catch (error) {
    console.error('Error opening database:', error);
    throw error;
  }
};
