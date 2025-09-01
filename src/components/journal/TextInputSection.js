import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

const TextInputSection = ({
  title,
  items = [],
  onUpdateItems,
  placeholder = "Enter text here...",
  color = theme.colors.primary,
  icon = "text",
  numInputs = 3, // Fixed number of inputs
}) => {
  // Ensure we always have the right number of items
  const normalizedItems = [...items];
  while (normalizedItems.length < numInputs) {
    normalizedItems.push('');
  }
  while (normalizedItems.length > numInputs) {
    normalizedItems.pop();
  }

  const handleTextChange = (index, text) => {
    const updatedItems = [...normalizedItems];
    updatedItems[index] = text;
    onUpdateItems(updatedItems);
  };

  const handleClearItem = (index) => {
    const updatedItems = [...normalizedItems];
    updatedItems[index] = '';
    onUpdateItems(updatedItems);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons 
            name={icon} 
            size={20} 
            color={color} 
            style={styles.icon} 
          />
          <Text style={[styles.title, { color }]}>{title}</Text>
        </View>
      </View>

      {/* Text Inputs */}
      <View style={styles.inputsContainer}>
        {normalizedItems.map((item, index) => (
          <View key={index} style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.textInput, 
                  { borderColor: color + '20', color: theme.colors.text }
                ]}
                value={item}
                onChangeText={(text) => handleTextChange(index, text)}
                placeholder={`${placeholder}`}
                placeholderTextColor={theme.colors.textLight}
                multiline
                numberOfLines={2}
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>
            
            <TouchableOpacity
              onPress={() => handleClearItem(index)}
              style={[
                styles.removeButton,
                { opacity: item.trim() === '' ? 0.3 : 1.0 }
              ]}
              disabled={item.trim() === ''}
            >
              <Ionicons 
                name="trash-outline" 
                size={18} 
                color={item.trim() === '' ? theme.colors.textLight : theme.colors.error} 
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
  },
  inputsContainer: {
    gap: theme.spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  inputContainer: {
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    fontSize: theme.typography.fontSize.md,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  removeButton: {
    marginLeft: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
});

export default TextInputSection;
