import { useState, useEffect, useMemo, useCallback } from 'react';
import { doc, setDoc, collection, query, where, onSnapshot, addDoc, deleteDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '@/config/firebase';
import { useAuth } from './AuthContext';
import { UserProfile, Expense, SafeToSpendData, PersonalityMode } from '@/types';
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

  const getEmotionalMessage = useCallback((safeToSpendData: SafeToSpendData | null, mode: PersonalityMode): string => {
    if (!safeToSpendData) return '';

    const { percentageUsed } = safeToSpendData;

    if (mode === 'bro') {
      if (percentageUsed < 50) {
        return "🔥 Yo bro, you're crushing it! Keep it up!";
      } else if (percentageUsed < 75) {
        return "💪 Solid work bro! You're staying on track.";
      } else if (percentageUsed < 90) {
        return "😬 Careful bro, you're getting close to the limit!";
      } else {
        return "🚨 Whoa bro! Time to slow down on spending!";
      }
    } else {
      if (percentageUsed < 50) {
        return "✅ Excellent progress. You're well within budget.";
      } else if (percentageUsed < 75) {
        return "📊 Good job. You're maintaining your budget.";
      } else if (percentageUsed < 90) {
        return "⚠️ Warning: Approaching your spending limit.";
      } else {
        return "🔴 Alert: You've exceeded your safe spending threshold.";
      }
    }
  }, []);

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
    getEmotionalMessage
  }), [userProfile, expenses, loading, theme, toggleTheme, createUserProfile, updateUserProfile, addExpense, deleteExpense, safeToSpend, getEmotionalMessage]);
});
