import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';

const GoalsSection = ({ goals, onUpdateGoals, onToggleGoalCompletion }) => {
  const updateGoalText = (index, text) => {
    const updatedGoals = goals.map((goal, i) => 
      i === index ? { ...goal, text } : goal
    );
    onUpdateGoals(updatedGoals);
  };

  return (
    <View style={globalStyles.section}>
      <View style={[globalStyles.sectionHeader, styles.headerContainer]}>
        <Ionicons 
          name="trophy" 
          size={24} 
          color={theme.colors.goals} 
          style={styles.icon} 
        />
        <Text style={[globalStyles.cardTitle, { color: theme.colors.goals }]}>
          Today's Goals
        </Text>
      </View>
      
      {goals.map((goal, index) => (
        <View key={index} style={styles.goalItem}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              goal.completed && styles.checkboxCompleted
            ]}
            onPress={() => onToggleGoalCompletion(index)}
          >
            {goal.completed && (
              <Ionicons 
                name="checkmark" 
                size={16} 
                color={theme.colors.surface} 
              />
            )}
          </TouchableOpacity>
          
          <TextInput
            style={[
              styles.goalInput,
              goal.completed && styles.goalInputCompleted
            ]}
            placeholder={`Goal ${index + 1}...`}
            placeholderTextColor={theme.colors.textLight}
            value={goal.text}
            onChangeText={(text) => updateGoalText(index, text)}
            multiline={false}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: theme.spacing.md,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 2,
    borderColor: theme.colors.goals,
    marginRight: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  checkboxCompleted: {
    backgroundColor: theme.colors.goals,
  },
  goalInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    padding: 0,
  },
  goalInputCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.textSecondary,
  },
});

export default GoalsSection;
