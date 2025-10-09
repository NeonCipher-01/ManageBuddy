// export type PersonalityMode = 'bro' | 'professional';

// export interface UserProfile {
//   uid: string;
//   name: string;
//   monthlyIncome: number;
//   bills: number;
//   mode: PersonalityMode;
//   setupCompleted: boolean;
//   createdAt: string;
// }

// export interface Expense {
//   id: string;
//   amount: number;
//   category: string;
//   note?: string;
//   date: string;
//   userId: string;
// }

// export type ExpenseCategory = 
//   | 'Food & Dining'
//   | 'Transportation'
//   | 'Shopping'
//   | 'Entertainment'
//   | 'Bills & Utilities'
//   | 'Healthcare'
//   | 'Other';

// export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
//   'Food & Dining',
//   'Transportation',
//   'Shopping',
//   'Entertainment',
//   'Bills & Utilities',
//   'Healthcare',
//   'Other'
// ];

// export interface SafeToSpendData {
//   amount: number;
//   remainingDays: number;
//   totalExpenses: number;
//   percentageUsed: number;
// }




export type PersonalityMode = 'bro' | 'professional';

export type Currency = {
  code: string;
  symbol: string;
  name: string;
  locale: string;
};

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', locale: 'de-CH' },
  { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee', locale: 'en-PK' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', locale: 'bn-BD' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', locale: 'ar-SA' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso', locale: 'es-MX' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', locale: 'en-ZA' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', locale: 'ko-KR' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', locale: 'tr-TR' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', locale: 'ru-RU' },
];

export interface UserProfile {
  uid: string;
  name: string;
  monthlyIncome: number;
  bills: number;
  mode: PersonalityMode;
  currency: string; // Currency code (USD, EUR, INR, etc.)
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

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCheckDate: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface SpendingPrediction {
  projectedTotal: number;
  projectedOverage: number;
  isOnTrack: boolean;
  daysAnalyzed: number;
}

export function getCategoryIcon(category: ExpenseCategory): string {
  const iconMap: Record<ExpenseCategory, string> = {
    'Food & Dining': '🍔',
    'Transportation': '🚗',
    'Shopping': '🛍️',
    'Entertainment': '🎮',
    'Bills & Utilities': '💡',
    'Healthcare': '⚕️',
    'Other': '📦'
  };
  return iconMap[category];
}