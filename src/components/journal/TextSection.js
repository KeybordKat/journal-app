import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';

const TextSection = ({ 
  title, 
  items, 
  onUpdateItems, 
  iconName, 
  color, 
  placeholder 
}) => {
  const updateItemText = (index, text) => {
    const updatedItems = items.map((item, i) => 
      i === index ? text : item
    );
    onUpdateItems(updatedItems);
  };

  return (
    <View style={globalStyles.section}>
      <View style={[globalStyles.sectionHeader, styles.headerContainer]}>
        <Ionicons 
          name={iconName} 
          size={24} 
          color={color} 
          style={styles.icon} 
        />
        <Text style={[globalStyles.cardTitle, { color }]}>
          {title}
        </Text>
      </View>
      
      {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <Text style={styles.itemNumber}>{index + 1}.</Text>
          <TextInput
            style={styles.itemInput}
            placeholder={`${placeholder} ${index + 1}...`}
            placeholderTextColor={theme.colors.textLight}
            value={item}
            onChangeText={(text) => updateItemText(index, text)}
            multiline={true}
            numberOfLines={2}
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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  itemNumber: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.sm,
    marginTop: theme.spacing.xs,
    fontWeight: '500',
  },
  itemInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    padding: 0,
    textAlignVertical: 'top',
  },
});

export default TextSection;
