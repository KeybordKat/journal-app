# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Start development server with Metro bundler
npm start

# Run on specific platforms
npm run android    # Launch on Android device/emulator
npm run ios         # Launch on iOS simulator
npm run web         # Launch in web browser

# Start with specific options
npx expo start --clear    # Clear cache and start
npx expo start --offline  # Start in offline mode
```

### Device Testing
```bash
# In the Metro terminal after running npm start:
# Press 'i' for iOS simulator
# Press 'a' for Android emulator  
# Press 'w' for web browser
# Press 'r' to reload
# Press 'm' to toggle menu
```

### Database Operations
```bash
# The app automatically initializes SQLite database on first run
# Database file: journal.db
# Location: Device's document directory (managed by expo-sqlite)

# To reset database during development:
# Uninstall app from device/simulator and reinstall
```

## Architecture Overview

### Tech Stack
- **Framework**: React Native with Expo SDK 53
- **Navigation**: React Navigation v7 with bottom tabs
- **Database**: SQLite via expo-sqlite for local data persistence
- **State Management**: React Context + useReducer pattern
- **Styling**: Custom theme system with React Native StyleSheet
- **Date Handling**: date-fns library

### Core Architecture Pattern

This app follows a **layered architecture** with clear separation of concerns:

**1. Context Layer (`src/context/`):**
- `JournalContext.js` provides global state management using React Context + useReducer
- Manages journal entries, loading states, and unsaved changes
- Automatically loads entries when date changes

**2. Service Layer (`src/services/`):**
- `database.js` handles SQLite initialization and connection
- `journalService.js` provides CRUD operations for journal entries
- `statsService.js` handles analytics and progress tracking
- All database operations use async/await with proper error handling

**3. Component Layer (`src/components/`):**
- Organized by domain: `common/`, `journal/`, `stats/`
- Components are functional with hooks
- Props follow clear contracts (goals array, callback functions)

**4. Screen Layer (`src/screens/`):**
- Bottom tab navigation: Today, History, Stats, Settings
- Each screen consumes context and renders domain components

### Data Flow Pattern

```
User Action → Component → Context Action → Service Call → Database → Context Update → UI Re-render
```

**Key Data Structures:**
```javascript
// Journal Entry Structure
{
  id: number,
  date: "YYYY-MM-DD",
  goals: [{ text: string, completed: boolean }],
  affirmations: string[],
  gratitude: string[],
  goals_completed: number,
  created_at: timestamp,
  updated_at: timestamp
}

// Context State Structure  
{
  currentEntry: JournalEntry | null,
  selectedDate: Date,
  isLoading: boolean,
  error: string | null,
  hasUnsavedChanges: boolean
}
```

### Styling Architecture

**Theme System (`src/styles/theme.js`):**
- Centralized design tokens (colors, typography, spacing, shadows)
- Semantic color naming (primary, goals, affirmations, gratitude)
- Consistent spacing scale and border radius values

**Global Styles (`src/styles/globalStyles.js`):**
- Reusable component styles (buttons, cards, sections)
- Safe area and container patterns

**Component Styles:**
- Local StyleSheet.create() for component-specific styles
- Theme values imported and used consistently

### Database Schema

**journal_entries table:**
```sql
CREATE TABLE journal_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT UNIQUE NOT NULL,           -- YYYY-MM-DD format
  goals TEXT NOT NULL,                 -- JSON array of goal objects
  affirmations TEXT NOT NULL,          -- JSON array of strings
  gratitude TEXT NOT NULL,             -- JSON array of strings  
  goals_completed INTEGER DEFAULT 0,   -- Computed field for stats
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Development Patterns

### Adding New Journal Sections
When adding sections beyond Goals (like Affirmations, Gratitude):

1. **Update Context Actions**: Add action types and reducer cases in `JournalContext.js`
2. **Create Section Component**: Follow `GoalsSection.js` pattern in `src/components/journal/`
3. **Update HomeScreen**: Import and render new section component
4. **Update Service**: Modify `JournalService` CRUD operations if needed

### State Management Pattern
- Use `useJournal()` hook to access context in components
- All state mutations go through reducer actions
- Service calls are handled in context, not components
- Loading and error states are managed centrally

### Component Development
- Functional components with hooks only
- Props should be explicitly typed in development
- Follow existing naming: `onUpdateX`, `onToggleX` for callbacks
- Use theme values for all styling (no magic numbers)

### Database Development  
- All database operations are async and wrapped in try/catch
- JSON.stringify/parse for complex data types
- Use date-fns format() for consistent date strings
- Service methods are static class methods

## Current Implementation Status

**✅ Completed:**
- Project setup with Expo and navigation
- SQLite database with journal_entries table
- Goals tracking with completion states
- Context-based state management
- Theme system and base styling
- Today screen with date display and save functionality

**🚧 In Progress (placeholders exist):**
- Affirmations section (UI placeholder in HomeScreen)
- Gratitude section (UI placeholder in HomeScreen)  
- Statistics dashboard (StatsScreen component exists)
- History/calendar view (HistoryScreen component exists)

**📅 Planned:**
- Data export functionality
- UI animations and transitions
- Settings and customization options

## File Organization

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Basic elements (Button, Input, Card)
│   ├── journal/        # Domain-specific (GoalsSection, TextSection)
│   └── stats/          # Statistics components
├── screens/            # Main application screens
├── navigation/         # Navigation configuration
├── services/           # Data access layer
├── context/            # Global state management
├── styles/             # Theme and global styles
├── constants/          # Application constants
└── utils/              # Helper functions
```

The app entry point is `App.js` which initializes the database and wraps the navigation in the Journal context provider.
