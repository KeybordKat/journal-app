import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const globalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Card styles
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.md,
  },
  
  cardTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  
  // Text styles
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  
  bodyText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.base,
  },
  
  secondaryText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  
  lightText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  
  // Button styles
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  
  buttonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
  },
  
  secondaryButton: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  
  secondaryButtonText: {
    color: theme.colors.text,
  },
  
  // Input styles
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
  },
  
  inputFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  
  // Section styles
  section: {
    marginBottom: theme.spacing.xs,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  
  // Spacing utilities
  marginSm: { margin: theme.spacing.sm },
  marginMd: { margin: theme.spacing.md },
  marginLg: { margin: theme.spacing.lg },
  
  paddingSm: { padding: theme.spacing.sm },
  paddingMd: { padding: theme.spacing.md },
  paddingLg: { padding: theme.spacing.lg },
  
  // Flex utilities
  flex1: { flex: 1 },
  flexRow: { flexDirection: 'row' },
  flexColumn: { flexDirection: 'column' },
  justifyCenter: { justifyContent: 'center' },
  justifyBetween: { justifyContent: 'space-between' },
  alignCenter: { alignItems: 'center' },
});
