// import { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
// import { useApp } from '@/contexts/AppContext';
// import { Colors } from '@/constants/colors';
// import { Plus, Moon, Sun } from 'lucide-react-native';
// import AddExpenseModal from '@/components/AddExpenseModal';

// export default function HomeScreen() {
//   const { userProfile, safeToSpend, getEmotionalMessage, theme, toggleTheme } = useApp();
//   const colors = Colors[theme];
//   const [modalVisible, setModalVisible] = useState<boolean>(false);

//   if (!userProfile || !safeToSpend) {
//     return (
//       <View style={[styles.container, { backgroundColor: colors.background }]}>
//         <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
//       </View>
//     );
//   }

//   const emotionalMessage = getEmotionalMessage(safeToSpend, userProfile.mode);

//   return (
//     <>
//       <View style={[styles.header, { backgroundColor: colors.background }]}>
//         <Text style={[styles.appName, { color: colors.text }]}>ManageBuddy</Text>
//         <TouchableOpacity onPress={toggleTheme} style={styles.headerButton}>
//           {theme === 'light' ? (
//             <Moon size={24} color={colors.text} />
//           ) : (
//             <Sun size={24} color={colors.text} />
//           )}
//         </TouchableOpacity>
//       </View>

//       <ScrollView 
//         style={[styles.container, { backgroundColor: colors.background }]}
//         contentContainerStyle={styles.content}
//       >
//         <View style={styles.greeting}>
//           <Text style={[styles.greetingText, { color: colors.textSecondary }]}>
//             Hey {userProfile.name}! 👋
//           </Text>
//         </View>

//         <View style={[styles.mainCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
//           <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
//             Safe to Spend Today
//           </Text>
//           <Text style={[styles.amount, { color: colors.primary }]}>
//             ${safeToSpend.amount.toFixed(2)}
//           </Text>
//           <View style={styles.progressBar}>
//             <View 
//               style={[
//                 styles.progressFill, 
//                 { 
//                   width: `${Math.min(safeToSpend.percentageUsed, 100)}%`,
//                   backgroundColor: safeToSpend.percentageUsed > 90 ? colors.danger : safeToSpend.percentageUsed > 75 ? colors.warning : colors.success
//                 }
//               ]} 
//             />
//           </View>
//           <Text style={[styles.progressText, { color: colors.textSecondary }]}>
//             {safeToSpend.percentageUsed.toFixed(1)}% of monthly budget used
//           </Text>
//         </View>

//         <View style={[styles.messageCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
//           <Text style={[styles.messageText, { color: colors.text }]}>
//             {emotionalMessage}
//           </Text>
//         </View>

//         <View style={styles.statsRow}>
//           <View style={[styles.statCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
//             <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Days Left</Text>
//             <Text style={[styles.statValue, { color: colors.text }]}>
//               {safeToSpend.remainingDays}
//             </Text>
//           </View>

//           <View style={[styles.statCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
//             <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Spent This Month</Text>
//             <Text style={[styles.statValue, { color: colors.text }]}>
//               ${safeToSpend.totalExpenses.toFixed(0)}
//             </Text>
//           </View>
//         </View>

//         <TouchableOpacity
//           style={[styles.addButton, { backgroundColor: colors.primary }]}
//           onPress={() => setModalVisible(true)}
//         >
//           <Plus size={24} color="#FFFFFF" />
//           <Text style={styles.addButtonText}>Add Expense</Text>
//         </TouchableOpacity>
//       </ScrollView>

//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <AddExpenseModal onClose={() => setModalVisible(false)} />
//       </Modal>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   content: {
//     padding: 20,
//     gap: 20,
//     paddingTop: 60,
//   },
//   header: {
//     position: 'absolute' as const,
//     top: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 60,
//     paddingBottom: 20,
//     zIndex: 10,
//   },
//   appName: {
//     fontSize: 24,
//     fontWeight: '700' as const,
//   },
//   loadingText: {
//     fontSize: 18,
//     textAlign: 'center',
//     marginTop: 40,
//   },
//   greeting: {
//     marginBottom: 8,
//   },
//   greetingText: {
//     fontSize: 18,
//     fontWeight: '600' as const,
//   },
//   mainCard: {
//     borderRadius: 24,
//     padding: 32,
//     alignItems: 'center',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 5,
//   },
//   cardLabel: {
//     fontSize: 16,
//     marginBottom: 12,
//   },
//   amount: {
//     fontSize: 56,
//     fontWeight: '700' as const,
//     marginBottom: 20,
//   },
//   progressBar: {
//     width: '100%',
//     height: 8,
//     backgroundColor: 'rgba(0, 0, 0, 0.1)',
//     borderRadius: 4,
//     overflow: 'hidden',
//     marginBottom: 8,
//   },
//   progressFill: {
//     height: '100%',
//     borderRadius: 4,
//   },
//   progressText: {
//     fontSize: 14,
//   },
//   messageCard: {
//     borderRadius: 16,
//     padding: 20,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   messageText: {
//     fontSize: 18,
//     fontWeight: '600' as const,
//     textAlign: 'center',
//   },
//   statsRow: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   statCard: {
//     flex: 1,
//     borderRadius: 16,
//     padding: 20,
//     alignItems: 'center',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   statLabel: {
//     fontSize: 12,
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   statValue: {
//     fontSize: 24,
//     fontWeight: '700' as const,
//   },
//   addButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 18,
//     borderRadius: 16,
//     gap: 8,
//     marginTop: 8,
//   },
//   addButtonText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: '700' as const,
//   },
//   headerButton: {
//     padding: 8,
//   },
// });






import { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { Colors } from '@/constants/colors';
import { Plus, Moon, Sun, TrendingUp, TrendingDown, Award, Flame } from 'lucide-react-native';
import AddExpenseModal from '@/components/AddExpenseModal';

export default function HomeScreen() {
  const { 
    userProfile, 
    safeToSpend, 
    getEmotionalMessage, 
    getDynamicGreeting,
    getSpendingPrediction,
    getStreakData,
    getAchievements,
    theme, 
    toggleTheme 
  } = useApp();
  const colors = Colors[theme];
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const prediction = useMemo(() => getSpendingPrediction(safeToSpend), [getSpendingPrediction, safeToSpend]);
  const streakData = useMemo(() => getStreakData(), [getStreakData]);
  const achievements = useMemo(() => getAchievements(), [getAchievements]);

  if (!userProfile || !safeToSpend) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  const emotionalMessage = getEmotionalMessage(safeToSpend, userProfile.mode);
  const dynamicGreeting = getDynamicGreeting(userProfile.name, safeToSpend.percentageUsed, userProfile.mode);

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
          <Text style={[styles.greetingText, { color: colors.text }]}>
            {dynamicGreeting}
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

        {prediction && (
          <View style={[styles.predictionCard, { 
            backgroundColor: prediction.isOnTrack ? colors.card : colors.card,
            borderLeftWidth: 4,
            borderLeftColor: prediction.isOnTrack ? colors.success : colors.danger,
            shadowColor: colors.shadow 
          }]}>
            <View style={styles.predictionHeader}>
              {prediction.isOnTrack ? (
                <TrendingUp size={24} color={colors.success} />
              ) : (
                <TrendingDown size={24} color={colors.danger} />
              )}
              <Text style={[styles.predictionTitle, { color: colors.text }]}>
                Spending Prediction
              </Text>
            </View>
            <Text style={[styles.predictionText, { color: colors.textSecondary }]}>
              {prediction.isOnTrack 
                ? userProfile.mode === 'bro'
                  ? `🎉 You're crushing it bro! At this rate, you'll save ${Math.abs(prediction.projectedOverage).toFixed(0)}!`
                  : `✅ Excellent pace. Projected savings: ${Math.abs(prediction.projectedOverage).toFixed(0)}`
                : userProfile.mode === 'bro'
                  ? `⚠️ Slow down bro! You might overspend by ${prediction.projectedOverage.toFixed(0)}`
                  : `⚠️ Warning: Projected overage of ${prediction.projectedOverage.toFixed(0)}`
              }
            </Text>
            <Text style={[styles.predictionSubtext, { color: colors.textSecondary }]}>
              Based on {prediction.daysAnalyzed} days of data
            </Text>
          </View>
        )}

        {streakData.currentStreak > 0 && (
          <View style={[styles.streakCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <View style={styles.streakHeader}>
              <Flame size={28} color="#FF6B35" />
              <View style={styles.streakInfo}>
                <Text style={[styles.streakTitle, { color: colors.text }]}>
                  {streakData.currentStreak} Day Streak!
                </Text>
                <Text style={[styles.streakSubtitle, { color: colors.textSecondary }]}>
                  {userProfile.mode === 'bro' 
                    ? "You're on fire bro! Keep it going! 🔥"
                    : "Excellent consistency. Maintain discipline."}
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

        {achievements.length > 0 && (
          <View style={[styles.achievementsCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <View style={styles.achievementsHeader}>
              <Award size={24} color={colors.primary} />
              <Text style={[styles.achievementsTitle, { color: colors.text }]}>
                Recent Achievements
              </Text>
            </View>
            <View style={styles.achievementsList}>
              {achievements.slice(0, 3).map((achievement) => (
                <View key={achievement.id} style={[styles.achievementItem, { backgroundColor: colors.background }]}>
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={[styles.achievementTitle, { color: colors.text }]}>
                      {achievement.title}
                    </Text>
                    <Text style={[styles.achievementDesc, { color: colors.textSecondary }]}>
                      {achievement.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

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
    marginBottom: 12,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 28,
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
  predictionCard: {
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  predictionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  predictionText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  predictionSubtext: {
    fontSize: 12,
    fontStyle: 'italic' as const,
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
    fontSize: 20,
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
  achievementsCard: {
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  achievementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  achievementIcon: {
    fontSize: 32,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
});
