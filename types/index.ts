export type PersonalityMode = 'bro' | 'professional';

export interface UserProfile {
  uid: string;
  name: string;
  monthlyIncome: number;
  bills: number;
  mode: PersonalityMode;
  setupCompleted: boolean;
  createdAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  note?: string;
  date: string;
  userId: string;
}

export type ExpenseCategory = 
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills & Utilities'
  | 'Healthcare'
  | 'Other';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Other'
];

export interface SafeToSpendData {
  amount: number;
  remainingDays: number;
  totalExpenses: number;
  percentageUsed: number;
}
