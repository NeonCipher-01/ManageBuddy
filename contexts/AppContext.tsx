// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { doc, setDoc, collection, query, where, onSnapshot, addDoc, deleteDoc } from 'firebase/firestore';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { db } from '@/config/firebase';
// import { useAuth } from './AuthContext';
// import { UserProfile, Expense, SafeToSpendData, PersonalityMode } from '@/types';
// import createContextHook from '@nkzw/create-context-hook';

// const THEME_KEY = '@managebuddy_theme';

// export const [AppProvider, useApp] = createContextHook(() => {
//   const { user } = useAuth();
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [theme, setTheme] = useState<'light' | 'dark'>('light');

//   useEffect(() => {
//     loadTheme();
//   }, []);

//   useEffect(() => {
//     if (!user) {
//       setUserProfile(null);
//       setExpenses([]);
//       setLoading(false);
//       return;
//     }

//     const userDocRef = doc(db, 'users', user.uid);
//     const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
//       if (docSnap.exists()) {
//         console.log('User profile loaded:', docSnap.data());
//         setUserProfile(docSnap.data() as UserProfile);
//       } else {
//         console.log('No user profile found');
//         setUserProfile(null);
//       }
//       setLoading(false);
//     });

//     const expensesQuery = query(
//       collection(db, 'expenses'),
//       where('userId', '==', user.uid)
//     );
//     const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
//       const expensesList: Expense[] = [];
//       snapshot.forEach((doc) => {
//         expensesList.push({ id: doc.id, ...doc.data() } as Expense);
//       });
//       console.log('Expenses loaded:', expensesList.length);
//       setExpenses(expensesList);
//     });

//     return () => {
//       unsubscribeUser();
//       unsubscribeExpenses();
//     };
//   }, [user]);

//   const loadTheme = async () => {
//     try {
//       const savedTheme = await AsyncStorage.getItem(THEME_KEY);
//       if (savedTheme === 'dark' || savedTheme === 'light') {
//         setTheme(savedTheme);
//       }
//     } catch (error) {
//       console.error('Error loading theme:', error);
//     }
//   };

//   const toggleTheme = useCallback(async () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     try {
//       await AsyncStorage.setItem(THEME_KEY, newTheme);
//       console.log('Theme saved:', newTheme);
//     } catch (error) {
//       console.error('Error saving theme:', error);
//     }
//   }, [theme]);

//   const createUserProfile = useCallback(async (profile: Omit<UserProfile, 'uid' | 'createdAt'>) => {
//     if (!user) throw new Error('No user logged in');

//     const newUserProfile: UserProfile = {
//       ...profile,
//       uid: user.uid,
//       createdAt: new Date().toISOString()
//     };

//     try {
//       await setDoc(doc(db, 'users', user.uid), newUserProfile);
//       console.log('User profile created:', newUserProfile);
//       setUserProfile(newUserProfile);
//     } catch (error) {
//       console.error('Error creating user profile:', error);
//       throw error;
//     }
//   }, [user]);

//   const updateUserProfile = useCallback(async (updates: Partial<UserProfile>) => {
//     if (!user || !userProfile) throw new Error('No user profile');

//     try {
//       const updatedProfile = { ...userProfile, ...updates };
//       await setDoc(doc(db, 'users', user.uid), updatedProfile);
//       console.log('User profile updated:', updates);
//       setUserProfile(updatedProfile);
//     } catch (error) {
//       console.error('Error updating user profile:', error);
//       throw error;
//     }
//   }, [user, userProfile]);

//   const addExpense = useCallback(async (expense: Omit<Expense, 'id' | 'userId' | 'date'>) => {
//     if (!user) throw new Error('No user logged in');

//     const newExpense: Omit<Expense, 'id'> = {
//       ...expense,
//       userId: user.uid,
//       date: new Date().toISOString()
//     };

//     try {
//       const docRef = await addDoc(collection(db, 'expenses'), newExpense);
//       console.log('Expense added:', docRef.id);
//     } catch (error) {
//       console.error('Error adding expense:', error);
//       throw error;
//     }
//   }, [user]);

//   const deleteExpense = useCallback(async (expenseId: string) => {
//     try {
//       await deleteDoc(doc(db, 'expenses', expenseId));
//       console.log('Expense deleted:', expenseId);
//     } catch (error) {
//       console.error('Error deleting expense:', error);
//       throw error;
//     }
//   }, []);

//   const safeToSpend = useMemo<SafeToSpendData | null>(() => {
//     if (!userProfile) return null;

//     const now = new Date();
//     const currentMonth = now.getMonth();
//     const currentYear = now.getFullYear();
//     const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
//     const currentDay = now.getDate();
//     const remainingDays = daysInMonth - currentDay + 1;

//     const monthlyExpenses = expenses.filter(expense => {
//       const expenseDate = new Date(expense.date);
//       return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
//     });

//     const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
//     const availableAmount = userProfile.monthlyIncome - userProfile.bills - totalExpenses;
//     const dailyBudget = remainingDays > 0 ? availableAmount / remainingDays : 0;
//     const percentageUsed = ((totalExpenses + userProfile.bills) / userProfile.monthlyIncome) * 100;

//     return {
//       amount: Math.max(0, dailyBudget),
//       remainingDays,
//       totalExpenses,
//       percentageUsed
//     };
//   }, [userProfile, expenses]);

//   const getEmotionalMessage = useCallback((safeToSpendData: SafeToSpendData | null, mode: PersonalityMode): string => {
//     if (!safeToSpendData) return '';

//     const { percentageUsed } = safeToSpendData;

//     if (mode === 'bro') {
//       if (percentageUsed < 50) {
//         return "🔥 Yo bro, you're crushing it! Keep it up!";
//       } else if (percentageUsed < 75) {
//         return "💪 Solid work bro! You're staying on track.";
//       } else if (percentageUsed < 90) {
//         return "😬 Careful bro, you're getting close to the limit!";
//       } else {
//         return "🚨 Whoa bro! Time to slow down on spending!";
//       }
//     } else {
//       if (percentageUsed < 50) {
//         return "✅ Excellent progress. You're well within budget.";
//       } else if (percentageUsed < 75) {
//         return "📊 Good job. You're maintaining your budget.";
//       } else if (percentageUsed < 90) {
//         return "⚠️ Warning: Approaching your spending limit.";
//       } else {
//         return "🔴 Alert: You've exceeded your safe spending threshold.";
//       }
//     }
//   }, []);

//   return useMemo(() => ({
//     userProfile,
//     expenses,
//     loading,
//     theme,
//     toggleTheme,
//     createUserProfile,
//     updateUserProfile,
//     addExpense,
//     deleteExpense,
//     safeToSpend,
//     getEmotionalMessage
//   }), [userProfile, expenses, loading, theme, toggleTheme, createUserProfile, updateUserProfile, addExpense, deleteExpense, safeToSpend, getEmotionalMessage]);
// });







import { useState, useEffect, useMemo, useCallback } from 'react';
import { doc, setDoc, collection, query, where, onSnapshot, addDoc, deleteDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '@/config/firebase';
import { useAuth } from './AuthContext';
import { UserProfile, Expense, SafeToSpendData, PersonalityMode, StreakData, Achievement, SpendingPrediction } from '@/types';
import createContextHook from '@nkzw/create-context-hook';

const THEME_KEY = '@managebuddy_theme';

export const [AppProvider, useApp] = createContextHook(() => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      setExpenses([]);
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        console.log('User profile loaded:', docSnap.data());
        setUserProfile(docSnap.data() as UserProfile);
      } else {
        console.log('No user profile found');
        setUserProfile(null);
      }
      setLoading(false);
    });

    const expensesQuery = query(
      collection(db, 'expenses'),
      where('userId', '==', user.uid)
    );
    const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
      const expensesList: Expense[] = [];
      snapshot.forEach((doc) => {
        expensesList.push({ id: doc.id, ...doc.data() } as Expense);
      });
      console.log('Expenses loaded:', expensesList.length);
      setExpenses(expensesList);
    });

    return () => {
      unsubscribeUser();
      unsubscribeExpenses();
    };
  }, [user]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = useCallback(async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_KEY, newTheme);
      console.log('Theme saved:', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, [theme]);

  const createUserProfile = useCallback(async (profile: Omit<UserProfile, 'uid' | 'createdAt'>) => {
    if (!user) throw new Error('No user logged in');

    const newUserProfile: UserProfile = {
      ...profile,
      uid: user.uid,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'users', user.uid), newUserProfile);
      console.log('User profile created:', newUserProfile);
      setUserProfile(newUserProfile);
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }, [user]);

  const updateUserProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) throw new Error('No user profile');

    try {
      const updatedProfile = { ...userProfile, ...updates };
      await setDoc(doc(db, 'users', user.uid), updatedProfile);
      console.log('User profile updated:', updates);
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }, [user, userProfile]);

  const addExpense = useCallback(async (expense: Omit<Expense, 'id' | 'userId' | 'date'>) => {
    if (!user) throw new Error('No user logged in');

    const newExpense: Omit<Expense, 'id'> = {
      ...expense,
      userId: user.uid,
      date: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, 'expenses'), newExpense);
      console.log('Expense added:', docRef.id);
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  }, [user]);

  const deleteExpense = useCallback(async (expenseId: string) => {
    try {
      await deleteDoc(doc(db, 'expenses', expenseId));
      console.log('Expense deleted:', expenseId);
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }, []);

  const safeToSpend = useMemo<SafeToSpendData | null>(() => {
    if (!userProfile) return null;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const currentDay = now.getDate();
    const remainingDays = daysInMonth - currentDay + 1;

    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const availableAmount = userProfile.monthlyIncome - userProfile.bills - totalExpenses;
    const dailyBudget = remainingDays > 0 ? availableAmount / remainingDays : 0;
    const percentageUsed = ((totalExpenses + userProfile.bills) / userProfile.monthlyIncome) * 100;

    return {
      amount: Math.max(0, dailyBudget),
      remainingDays,
      totalExpenses,
      percentageUsed
    };
  }, [userProfile, expenses]);

  const getDynamicGreeting = useCallback((name: string, percentageUsed: number, mode: PersonalityMode): string => {
    const hour = new Date().getHours();
    let timeGreeting = '';
    
    if (hour < 12) {
      timeGreeting = 'Good morning';
    } else if (hour < 18) {
      timeGreeting = 'Good afternoon';
    } else {
      timeGreeting = 'Good evening';
    }

    let performanceContext = '';
    if (mode === 'bro') {
      if (percentageUsed < 50) {
        performanceContext = "You're doing amazing, bro! 🔥";
      } else if (percentageUsed < 75) {
        performanceContext = "You're on track, bro! 💪";
      } else {
        performanceContext = "Be mindful today, bro 🧘";
      }
    } else {
      if (percentageUsed < 50) {
        performanceContext = "Excellent financial discipline.";
      } else if (percentageUsed < 75) {
        performanceContext = "You're maintaining good control.";
      } else {
        performanceContext = "Exercise caution with spending.";
      }
    }

    return `${timeGreeting}, ${name}! ${performanceContext}`;
  }, []);

  const getEmotionalMessage = useCallback((safeToSpendData: SafeToSpendData | null, mode: PersonalityMode): string => {
    if (!safeToSpendData) return '';

    const { percentageUsed, remainingDays } = safeToSpendData;
    const isEndOfMonth = remainingDays <= 5;

    const broMessages = {
      excellent: [
        "🔥 Yo bro, you're absolutely crushing it! Keep this energy!",
        "💎 Legendary performance bro! You're building wealth!",
        "🚀 You're on fire! This is how winners do it!",
        "⭐ Bro, you're a financial rockstar right now!"
      ],
      good: [
        "💪 Solid work bro! You're staying on track beautifully.",
        "👊 Nice job bro! Keep this momentum going!",
        "✨ You're doing great! Stay focused!",
        "🎯 Right on target bro! Love to see it!"
      ],
      warning: [
        "😬 Careful bro, you're getting close to the limit!",
        "⚠️ Slow down a bit bro, maybe skip that coffee today?",
        "🤔 Think twice before spending more, bro!",
        "💭 Time to be strategic with your money, bro!"
      ],
      danger: [
        "🚨 Whoa bro! Time to seriously slow down on spending!",
        "😰 Bro, you're overspending! Let's get back on track!",
        "🛑 Stop right there bro! Your wallet needs a break!",
        "⛔ Red alert bro! No more spending this month!"
      ],
      endOfMonth: [
        "🏁 Almost there bro! Just a few more days to go!",
        "💪 Final stretch bro! You got this!",
        "🎉 Month's almost over! Finish strong bro!"
      ]
    };

    const proMessages = {
      excellent: [
        "✅ Excellent progress. You're well within budget.",
        "📈 Outstanding financial management this month.",
        "💼 Exemplary spending discipline demonstrated.",
        "🎯 You're exceeding your financial goals."
      ],
      good: [
        "📊 Good job. You're maintaining your budget effectively.",
        "✓ Solid performance. Continue this approach.",
        "💚 You're on track. Well managed.",
        "📋 Consistent and controlled spending pattern."
      ],
      warning: [
        "⚠️ Warning: Approaching your spending limit.",
        "🔔 Caution advised. Consider reducing discretionary spending.",
        "📉 Budget threshold nearing. Exercise restraint.",
        "⚡ Spending pace requires attention."
      ],
      danger: [
        "🔴 Alert: You've exceeded your safe spending threshold.",
        "❌ Critical: Budget significantly overrun.",
        "🚫 Immediate action required to control spending.",
        "⛔ Spending has exceeded acceptable limits."
      ],
      endOfMonth: [
        "📅 Month end approaching. Maintain current discipline.",
        "🏁 Final days of the month. Stay focused.",
        "📆 Nearly complete. Finish with control."
      ]
    };

    const messages = mode === 'bro' ? broMessages : proMessages;
    const randomIndex = Math.floor(Math.random() * 4);

    if (isEndOfMonth) {
      return messages.endOfMonth[Math.floor(Math.random() * messages.endOfMonth.length)];
    }

    if (percentageUsed < 50) {
      return messages.excellent[randomIndex % messages.excellent.length];
    } else if (percentageUsed < 75) {
      return messages.good[randomIndex % messages.good.length];
    } else if (percentageUsed < 90) {
      return messages.warning[randomIndex % messages.warning.length];
    } else {
      return messages.danger[randomIndex % messages.danger.length];
    }
  }, []);

  const getSpendingPrediction = useCallback((safeToSpendData: SafeToSpendData | null): SpendingPrediction | null => {
    if (!safeToSpendData || !userProfile) return null;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const currentDay = now.getDate();
    const daysElapsed = currentDay;

    if (daysElapsed < 3) return null;

    const dailyAverage = safeToSpendData.totalExpenses / daysElapsed;
    const projectedTotal = dailyAverage * daysInMonth;
    const availableBudget = userProfile.monthlyIncome - userProfile.bills;
    const projectedOverage = projectedTotal - availableBudget;
    const isOnTrack = projectedTotal <= availableBudget;

    return {
      projectedTotal,
      projectedOverage,
      isOnTrack,
      daysAnalyzed: daysElapsed
    };
  }, [userProfile]);

  const getStreakData = useCallback((): StreakData => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentDay = now.getDate();

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    if (!userProfile) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastCheckDate: now.toISOString()
      };
    }

    const dailyBudget = (userProfile.monthlyIncome - userProfile.bills) / new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let day = 1; day <= currentDay; day++) {
      const dayExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getDate() === day && 
               expenseDate.getMonth() === currentMonth && 
               expenseDate.getFullYear() === currentYear;
      });

      const dayTotal = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      if (dayTotal <= dailyBudget) {
        tempStreak++;
        if (day === currentDay) {
          currentStreak = tempStreak;
        }
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    }

    return {
      currentStreak,
      longestStreak,
      lastCheckDate: now.toISOString()
    };
  }, [userProfile, expenses]);

  const getAchievements = useCallback((): Achievement[] => {
    const achievements: Achievement[] = [];
    const streakData = getStreakData();
    const now = new Date().toISOString();

    if (streakData.currentStreak >= 7) {
      achievements.push({
        id: 'week_streak',
        title: '7 Day Streak',
        description: 'Stayed under budget for 7 days straight!',
        icon: '🔥',
        unlockedAt: now
      });
    }

    if (streakData.currentStreak >= 14) {
      achievements.push({
        id: 'two_week_streak',
        title: '14 Day Streak',
        description: 'Two weeks of amazing discipline!',
        icon: '⭐',
        unlockedAt: now
      });
    }

    if (streakData.longestStreak >= 30) {
      achievements.push({
        id: 'month_master',
        title: 'Month Master',
        description: 'Perfect month of budget control!',
        icon: '👑',
        unlockedAt: now
      });
    }

    if (safeToSpend && safeToSpend.percentageUsed < 50) {
      const now = new Date();
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      if (now.getDate() > daysInMonth / 2) {
        achievements.push({
          id: 'halfway_hero',
          title: 'Halfway Hero',
          description: 'Less than 50% spent at month midpoint!',
          icon: '💎',
          unlockedAt: now.toISOString()
        });
      }
    }

    return achievements;
  }, [getStreakData, safeToSpend]);

  return useMemo(() => ({
    userProfile,
    expenses,
    loading,
    theme,
    toggleTheme,
    createUserProfile,
    updateUserProfile,
    addExpense,
    deleteExpense,
    safeToSpend,
    getEmotionalMessage,
    getDynamicGreeting,
    getSpendingPrediction,
    getStreakData,
    getAchievements
  }), [userProfile, expenses, loading, theme, toggleTheme, createUserProfile, updateUserProfile, addExpense, deleteExpense, safeToSpend, getEmotionalMessage, getDynamicGreeting, getSpendingPrediction, getStreakData, getAchievements]);
});



