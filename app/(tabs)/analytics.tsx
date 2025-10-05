import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { Colors } from '@/constants/colors';
import { useMemo } from 'react';
import { Flame } from 'lucide-react-native';
import { getCategoryIcon, ExpenseCategory } from '@/types';

export default function AnalyticsScreen() {
  const { userProfile, expenses, safeToSpend, getEmotionalMessage, getStreakData, theme } = useApp();
  const colors = Colors[theme];
  const streakData = useMemo(() => getStreakData(), [getStreakData]);

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
        {streakData.currentStreak > 0 && (
          <View style={[styles.streakCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <View style={styles.streakHeader}>
              <Flame size={32} color="#FF6B35" />
              <View style={styles.streakInfo}>
                <Text style={[styles.streakTitle, { color: colors.text }]}>
                  {streakData.currentStreak} Day Streak! 🔥
                </Text>
                <Text style={[styles.streakSubtitle, { color: colors.textSecondary }]}>
                  {userProfile?.mode === 'bro' 
                    ? "You're on fire bro! Keep crushing it!"
                    : "Excellent consistency. Maintain this discipline."}
                </Text>
              </View>
            </View>
            {streakData.longestStreak > streakData.currentStreak && (
              <Text style={[styles.streakRecord, { color: colors.textSecondary }]}>
                Personal best: {streakData.longestStreak} days
              </Text>
            )}
          </View>
        )}

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
                <View style={styles.categoryNameContainer}>
                  <Text style={styles.categoryIconSmall}>{getCategoryIcon(item.x as ExpenseCategory)}</Text>
                  <Text style={[styles.categoryName, { color: colors.text }]}>{item.x}</Text>
                </View>
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
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  categoryNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryIconSmall: {
    fontSize: 18,
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
  streakCard: {
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  streakInfo: {
    flex: 1,
  },
  streakTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  streakSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  streakRecord: {
    fontSize: 12,
    marginTop: 12,
    fontStyle: 'italic' as const,
  },
});
