# Journal App 📱✨

A cozy and aesthetic mobile journaling app built with React Native and Expo, designed for daily reflection through goals, affirmations, and gratitude.

## Features

- **Daily Goals**: Set and track 3 daily goals with checkboxes
- **Affirmations**: Write 3 daily affirmations to boost positivity
- **Gratitude**: Record 3 things you're grateful for each day
- **Progress Tracking**: View completion rates and statistics
- **History**: Browse past journal entries
- **Cross-Platform**: Works on both iOS and Android

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **Database**: SQLite (expo-sqlite)
- **Styling**: Custom theme with React Native Paper components
- **State Management**: React Context + useReducer
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo Go app on your phone (optional, for testing)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/journal-app.git
   cd journal-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on your device:
   - **Phone**: Scan QR code with Expo Go app
   - **iOS Simulator**: Press `i` in terminal
   - **Android Emulator**: Press `a` in terminal
   - **Web Browser**: Press `w` in terminal

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Basic UI elements (Button, Input, Card)
│   ├── journal/        # Journal-specific components
│   └── stats/          # Statistics components
├── screens/            # App screens
├── navigation/         # Navigation setup
├── services/           # Data layer (database, API calls)
├── context/            # State management
├── utils/              # Helper functions
├── styles/             # Theme and global styles
└── constants/          # App constants
```

## Current Status

✅ Basic project setup complete  
✅ Navigation structure  
✅ Database schema and services  
✅ Goals tracking functionality  
🚧 Affirmations section (coming next)  
🚧 Gratitude section (coming next)  
🚧 Statistics dashboard  
🚧 History view  

## Next Steps

1. Complete affirmations and gratitude sections
2. Build statistics dashboard
3. Implement history/calendar view
4. Add data export functionality
5. Polish UI/UX and animations

## Development

To contribute or continue development:

1. The main entry point is `HomeScreen.js`
2. Database operations are handled in `src/services/`
3. Global state is managed in `src/context/JournalContext.js`
4. Styling follows the theme defined in `src/styles/theme.js`

## Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run in web browser
