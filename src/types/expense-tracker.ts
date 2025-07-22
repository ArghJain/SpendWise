
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: "income" | "expense";
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface ExpenseStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyChange: number;
}

export interface RecurringExpense {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  frequency: "monthly" | "weekly" | "yearly";
  nextDueDate: string;
  lastProcessed?: string;
  isActive: boolean;
  dayOfMonth?: number;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  icon: string;
  color: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "no-spend" | "reduce-category" | "save-amount" | "streak";
  targetValue: number;
  currentValue: number;
  duration: number; // in days
  category?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isCompleted: boolean;
  participants: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  requirement: string;
}

export interface UserProfile {
  id: string;
  name: string;
  totalBadges: number;
  completedGoals: number;
  completedChallenges: number;
  savingsRate: number;
  currentStreak: number;
  level: number;
}

export interface LeaderboardEntry {
  id: string;
  anonymousName: string;
  savingsRate: number;
  completedGoals: number;
  completedChallenges: number;
  currentStreak: number;
  level: number;
}
