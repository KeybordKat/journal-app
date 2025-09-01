import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { JournalService } from '../services/journalService';
import { format } from 'date-fns';

// Initial state
const initialState = {
  currentEntry: null,
  selectedDate: new Date(),
  isLoading: false,
  error: null,
  hasUnsavedChanges: false,
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_CURRENT_ENTRY: 'SET_CURRENT_ENTRY',
  SET_SELECTED_DATE: 'SET_SELECTED_DATE',
  UPDATE_GOALS: 'UPDATE_GOALS',
  UPDATE_AFFIRMATIONS: 'UPDATE_AFFIRMATIONS',
  UPDATE_GRATITUDE: 'UPDATE_GRATITUDE',
  TOGGLE_GOAL_COMPLETION: 'TOGGLE_GOAL_COMPLETION',
  SET_UNSAVED_CHANGES: 'SET_UNSAVED_CHANGES',
  RESET_ENTRY: 'RESET_ENTRY',
};

// Helper function to create empty entry
const createEmptyEntry = () => ({
  goals: [
    { text: '', completed: false },
    { text: '', completed: false },
    { text: '', completed: false },
  ],
  affirmations: ['', '', ''],
  gratitude: ['', '', ''],
});

// Reducer
const journalReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    
    case ActionTypes.SET_CURRENT_ENTRY:
      return {
        ...state,
        currentEntry: action.payload,
        hasUnsavedChanges: false,
        isLoading: false,
      };
    
    case ActionTypes.UPDATE_GOALS:
      return {
        ...state,
        currentEntry: {
          ...state.currentEntry,
          goals: action.payload,
        },
        hasUnsavedChanges: true,
      };
    
    case ActionTypes.TOGGLE_GOAL_COMPLETION:
      const updatedGoals = state.currentEntry.goals.map((goal, index) => 
        index === action.payload 
          ? { ...goal, completed: !goal.completed }
          : goal
      );
      return {
        ...state,
        currentEntry: {
          ...state.currentEntry,
          goals: updatedGoals,
        },
        hasUnsavedChanges: true,
      };
    
    default:
      return state;
  }
};

// Create context
const JournalContext = createContext();

// Context provider
export const JournalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(journalReducer, initialState);

  // Load entry for selected date
  const loadEntryForDate = async (date) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    
    try {
      const entry = await JournalService.getEntry(date);
      
      if (entry) {
        dispatch({ type: ActionTypes.SET_CURRENT_ENTRY, payload: entry });
      } else {
        const emptyEntry = {
          ...createEmptyEntry(),
          date: format(date, 'yyyy-MM-dd'),
        };
        dispatch({ type: ActionTypes.SET_CURRENT_ENTRY, payload: emptyEntry });
      }
    } catch (error) {
      console.error('Error loading entry:', error);
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
    }
  };

  // Save current entry
  const saveEntry = async () => {
    if (!state.currentEntry || !state.hasUnsavedChanges) {
      return false;
    }

    try {
      const { goals, affirmations, gratitude } = state.currentEntry;
      const existingEntry = await JournalService.getEntry(state.selectedDate);
      
      if (existingEntry) {
        await JournalService.updateEntry(state.selectedDate, goals, affirmations, gratitude);
      } else {
        await JournalService.createEntry(state.selectedDate, goals, affirmations, gratitude);
      }
      
      dispatch({ type: ActionTypes.SET_UNSAVED_CHANGES, payload: false });
      return true;
    } catch (error) {
      console.error('Error saving entry:', error);
      return false;
    }
  };

  // Update functions
  const updateGoals = (goals) => {
    dispatch({ type: ActionTypes.UPDATE_GOALS, payload: goals });
  };

  const toggleGoalCompletion = (index) => {
    dispatch({ type: ActionTypes.TOGGLE_GOAL_COMPLETION, payload: index });
  };

  // Load entry when selected date changes
  useEffect(() => {
    if (state.selectedDate) {
      loadEntryForDate(state.selectedDate);
    }
  }, [state.selectedDate]);

  const value = {
    ...state,
    loadEntryForDate,
    saveEntry,
    updateGoals,
    toggleGoalCompletion,
  };

  return (
    <JournalContext.Provider value={value}>
      {children}
    </JournalContext.Provider>
  );
};

// Hook to use journal context
export const useJournal = () => {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};
