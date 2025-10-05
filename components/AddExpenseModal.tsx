import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { Colors } from '@/constants/colors';
import { X } from 'lucide-react-native';
import { EXPENSE_CATEGORIES, ExpenseCategory, getCategoryIcon } from '@/types';

interface AddExpenseModalProps {
  onClose: () => void;
}

export default function AddExpenseModal({ onClose }: AddExpenseModalProps) {
  const { theme, addExpense, userProfile, safeToSpend } = useApp();
  const colors = Colors[theme];

  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('Food & Dining');
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const getFriendlyFeedback = (amount: number, category: ExpenseCategory, remainingAmount: number): string => {
    const mode = userProfile?.mode || 'bro';
    const categoryIcon = getCategoryIcon(category);
    
    if (mode === 'bro') {
      if (remainingAmount > 0) {
        return `${categoryIcon} Nice! Spent $${amount.toFixed(0)} on ${category}. Still got $${remainingAmount.toFixed(0)} left for today, bro! 💪`;
      } else {
        return `${categoryIcon} Added $${amount.toFixed(0)} for ${category}. Watch your spending today, bro! 😬`;
      }
    } else {
      if (remainingAmount > 0) {
        return `${categoryIcon} Expense recorded: $${amount.toFixed(0)} for ${category}. Remaining daily budget: $${remainingAmount.toFixed(0)}.`;
      } else {
        return `${categoryIcon} Expense recorded: $${amount.toFixed(0)} for ${category}. Daily budget exceeded. Exercise caution.`;
      }
    }
  };

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await addExpense({
        amount: parseFloat(amount),
        category,
        note: note.trim() || ''
      });
      
      // Calculate remaining amount for friendly feedback
      const expenseAmount = parseFloat(amount);
      const remainingAmount = (safeToSpend?.amount || 0) - expenseAmount;
      const feedback = getFriendlyFeedback(expenseAmount, category, remainingAmount);
      
      Alert.alert('Expense Added! 🎉', feedback);
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={[styles.modal, { backgroundColor: colors.card }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Add Expense</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Amount</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Category</Text>
            <View style={styles.categoryGrid}>
              {EXPENSE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    { 
                      backgroundColor: category === cat ? colors.primary : colors.background,
                      borderColor: category === cat ? colors.primary : colors.border
                    }
                  ]}
                  onPress={() => setCategory(cat)}
                  disabled={loading}
                >
                  <Text style={styles.categoryIcon}>{getCategoryIcon(cat)}</Text>
                  <Text 
                    style={[
                      styles.categoryText,
                      { color: category === cat ? '#FFFFFF' : colors.text }
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Note (Optional)</Text>
            <TextInput
              style={[styles.input, styles.noteInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Add a note..."
              placeholderTextColor={colors.textSecondary}
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
              editable={!loading}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
            onPress={onClose}
            disabled={loading}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
              {loading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  noteInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {},
  buttonText: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
