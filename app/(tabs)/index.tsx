import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { Colors } from '@/constants/colors';
import { Plus, Moon, Sun } from 'lucide-react-native';
import AddExpenseModal from '@/components/AddExpenseModal';

export default function HomeScreen() {
  const { userProfile, safeToSpend, getEmotionalMessage, theme, toggleTheme } = useApp();
  const colors = Colors[theme];
  const [modalVisible, setModalVisible] = useState<boolean>(false);

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
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.appName, { color: colors.text }]}>ManageBuddy</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.headerButton}>
          {theme === 'light' ? (
            <Moon size={24} color={colors.text} />
          ) : (
            <Sun size={24} color={colors.text} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
      >
        <View style={styles.greeting}>
          <Text style={[styles.greetingText, { color: colors.textSecondary }]}>
            Hey {userProfile.name}! 👋
          </Text>
        </View>

        <View style={[styles.mainCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
            Safe to Spend Today
          </Text>
          <Text style={[styles.amount, { color: colors.primary }]}>
            ${safeToSpend.amount.toFixed(2)}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${Math.min(safeToSpend.percentageUsed, 100)}%`,
                  backgroundColor: safeToSpend.percentageUsed > 90 ? colors.danger : safeToSpend.percentageUsed > 75 ? colors.warning : colors.success
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {safeToSpend.percentageUsed.toFixed(1)}% of monthly budget used
          </Text>
        </View>

        <View style={[styles.messageCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.messageText, { color: colors.text }]}>
            {emotionalMessage}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Days Left</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {safeToSpend.remainingDays}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Spent This Month</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              ${safeToSpend.totalExpenses.toFixed(0)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setModalVisible(true)}
        >
          <Plus size={24} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <AddExpenseModal onClose={() => setModalVisible(false)} />
      </Modal>
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
    paddingTop: 60,
  },
  header: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    zIndex: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
  greeting: {
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  mainCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardLabel: {
    fontSize: 16,
    marginBottom: 12,
  },
  amount: {
    fontSize: 56,
    fontWeight: '700' as const,
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
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
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700' as const,
  },
  headerButton: {
    padding: 8,
  },
});
