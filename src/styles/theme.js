export const theme = {
  colors: {
    // Main brand colors - soft and cozy
    primary: '#b9a28d', // Soft purple
    primaryLight: '#EAD8C0',
    primaryDark: '#8D7B68',
    
    // Background colors
    background: '#efe9e6', // Warm off-white
    surface: '#FFFFFF',
    card: '#F9F5F3', // Slightly tinted white
    
    // Text colors
    text: '#2C2C2C', // Dark gray instead of pure black
    textSecondary: '#6B6B6B',
    textLight: '#9A9A9A',
    
    // Accent colors for different sections
    goals: '#B9A28D', // Soft green for goals
    affirmations: '#B9A28D', // Warm orange for affirmations
    gratitude: '#B9A28D', // Light purple for gratitude
    
    // Status colors
    success: '#81C784',
    warning: '#FFB74D',
    error: '#E57373',
    
    // Neutral colors
    border: '#E8E4E1',
    divider: '#F0EDE9',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  
  typography: {
    // Font families
    fontFamily: {
      regular: 'System', // iOS: San Francisco, Android: Roboto
      medium: 'System',
      bold: 'System',
    },
    
    // Font sizes
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    
    // Line heights
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.7,
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};
