import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { Colors } from '@/constants/colors';
import { useMemo } from 'react';

export default function AnalyticsScreen() {
  const { userProfile, expenses, safeToSpend, getEmotionalMessage, theme } = useApp();
  const colors = Colors[theme];

  const categoryData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    const categoryTotals: Record<string, number> = {};
    monthlyExpenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      x: category,
      y: amount,
      label: `$${amount.toFixed(0)}`
    }));
  }, [expenses]);

  const weeklyData = useMemo(() => {
    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    return last7Days.map(date => {
      const dayExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.toDateString() === date.toDateString();
      });

      const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      return {
        x: date.toLocaleDateString('en-US', { weekday: 'short' }),
        y: total
      };
    });
  }, [expenses]);

  if (!userProfile || !safeToSpend) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  const emotionalMessage = getEmotionalMessage(safeToSpend, userProfile.mode);

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Analytics',
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
        }}
      />
      
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
      >
        <View style={[styles.messageCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.messageText, { color: colors.text }]}>
            {emotionalMessage}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Monthly Overview</Text>
          <View style={styles.overviewRow}>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>Income</Text>
              <Text style={[styles.overviewValue, { color: colors.success }]}>
                ${userProfile.monthlyIncome.toFixed(0)}
              </Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>Bills</Text>
              <Text style={[styles.overviewValue, { color: colors.warning }]}>
                ${userProfile.bills.toFixed(0)}
              </Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>Spent</Text>
              <Text style={[styles.overviewValue, { color: colors.danger }]}>
                ${safeToSpend.totalExpenses.toFixed(0)}
              </Text>
            </View>
          </View>
        </View>

        {categoryData.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Spending by Category</Text>
            {categoryData.map((item, index) => (
              <View key={index} style={styles.categoryRow}>
                <Text style={[styles.categoryName, { color: colors.text }]}>{item.x}</Text>
                <Text style={[styles.categoryAmount, { color: colors.primary }]}>{item.label}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Last 7 Days</Text>
          {weeklyData.map((item, index) => (
            <View key={index} style={styles.dayRow}>
              <Text style={[styles.dayName, { color: colors.text }]}>{item.x}</Text>
              <View style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      width: `${Math.min((item.y / Math.max(...weeklyData.map(d => d.y), 1)) * 100, 100)}%`,
                      backgroundColor: colors.primary 
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.dayAmount, { color: colors.textSecondary }]}>${item.y.toFixed(0)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
  messageCard: {
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  messageText: {
    fontSize: 18,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overviewItem: {
    alignItems: 'center',
    gap: 8,
  },
  overviewLabel: {
    fontSize: 14,
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  categoryName: {
    fontSize: 16,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  dayName: {
    fontSize: 14,
    width: 40,
  },
  barContainer: {
    flex: 1,
    height: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  dayAmount: {
    fontSize: 14,
    width: 50,
    textAlign: 'right',
  },
});
