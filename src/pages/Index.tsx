import { useState } from "react";
import { DashboardHeader } from "@/components/expense-tracker/DashboardHeader";
import { ExpenseStats } from "@/components/expense-tracker/ExpenseStats";
import { ExpenseChart } from "@/components/expense-tracker/ExpenseChart";
import { TransactionList } from "@/components/expense-tracker/TransactionList";
import { CategoryManager } from "@/components/expense-tracker/CategoryManager";
import { AddTransactionModal } from "@/components/expense-tracker/AddTransactionModal";
import { RecurringExpenseManager } from "@/components/expense-tracker/RecurringExpenseManager";
import { AddRecurringExpenseModal } from "@/components/expense-tracker/AddRecurringExpenseModal";
import { SavingsGoals } from "@/components/expense-tracker/SavingsGoals";
import { Challenges } from "@/components/expense-tracker/Challenges";
import { BadgesShowcase } from "@/components/expense-tracker/BadgesShowcase";
import { Leaderboard } from "@/components/expense-tracker/Leaderboard";
import { AddSavingsGoalModal } from "@/components/expense-tracker/AddSavingsGoalModal";
import { useRecurringExpenses } from "@/hooks/useRecurringExpenses";
import { Transaction, Category, RecurringExpense, SavingsGoal, Challenge, Badge, LeaderboardEntry } from "@/types/expense-tracker";
import { toast } from "@/components/ui/sonner";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "transactions" | "categories" | "recurring" | "goals" | "challenges" | "badges" | "leaderboard">("dashboard");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddRecurringModalOpen, setIsAddRecurringModalOpen] = useState(false);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      description: "Grocery Shopping",
      amount: 1285.50,
      category: "Food",
      date: new Date().toISOString().split('T')[0],
      type: "expense"
    },
    {
      id: "2",
      description: "Salary",
      amount: 75000,
      category: "Income",
      date: new Date().toISOString().split('T')[0],
      type: "income"
    },
    {
      id: "3",
      description: "Coffee",
      amount: 150,
      category: "Food",
      date: "2024-07-07",
      type: "expense"
    }
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Food", color: "#FF6B6B", icon: "🍔" },
    { id: "2", name: "Transport", color: "#4ECDC4", icon: "🚗" },
    { id: "3", name: "Entertainment", color: "#45B7D1", icon: "🎬" },
    { id: "4", name: "Shopping", color: "#96CEB4", icon: "🛍️" },
    { id: "5", name: "Bills", color: "#FECA57", icon: "📄" },
    { id: "6", name: "Income", color: "#48CAE4", icon: "💰" },
  ]);

  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([
    {
      id: "r1",
      description: "Rent",
      amount: 25000,
      category: "Bills",
      type: "expense",
      frequency: "monthly",
      nextDueDate: "2024-08-01",
      isActive: true,
      dayOfMonth: 1
    },
    {
      id: "r2", 
      description: "Netflix Subscription",
      amount: 199,
      category: "Entertainment",
      type: "expense",
      frequency: "monthly",
      nextDueDate: "2024-07-15",
      isActive: true,
      dayOfMonth: 15
    }
  ]);

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    {
      id: "g1",
      title: "Emergency Fund",
      targetAmount: 100000,
      currentAmount: 35000,
      targetDate: "2024-12-31",
      category: "Savings",
      icon: "🏦",
      color: "#10B981",
      isCompleted: false,
      createdAt: "2024-01-01"
    },
    {
      id: "g2",
      title: "New Laptop",
      targetAmount: 80000,
      currentAmount: 80000,
      targetDate: "2024-08-15",
      category: "Shopping",
      icon: "💻",
      color: "#8B5CF6",
      isCompleted: true,
      createdAt: "2024-05-01"
    }
  ]);

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: "c1",
      title: "No-Spend Weekend",
      description: "Avoid all non-essential spending for the weekend",
      type: "no-spend",
      targetValue: 2,
      currentValue: 1,
      duration: 2,
      startDate: "2024-07-06",
      endDate: "2024-07-07",
      isActive: true,
      isCompleted: false,
      participants: 156
    },
    {
      id: "c2",
      title: "Cut Food Delivery by 50%",
      description: "Reduce your food delivery expenses by half this month",
      type: "reduce-category",
      targetValue: 50,
      currentValue: 25,
      duration: 30,
      category: "Food",
      startDate: "2024-07-01",
      endDate: "2024-07-31",
      isActive: false,
      isCompleted: false,
      participants: 89
    }
  ]);

  const [badges, setBadges] = useState<Badge[]>([
    {
      id: "b1",
      title: "First Goal",
      description: "Complete your first savings goal",
      icon: "🎯",
      color: "#10B981",
      isUnlocked: true,
      unlockedAt: "2024-06-15",
      requirement: "Complete 1 savings goal"
    },
    {
      id: "b2",
      title: "Budget Master",
      description: "Stay under budget for 3 consecutive months",
      icon: "📊",
      color: "#3B82F6",
      isUnlocked: false,
      requirement: "Stay under budget for 3 months"
    },
    {
      id: "b3",
      title: "Streak Saver",
      description: "Maintain a 30-day savings streak",
      icon: "🔥",
      color: "#F59E0B",
      isUnlocked: false,
      requirement: "Save money for 30 consecutive days"
    }
  ]);

  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([
    { id: "user1", anonymousName: "Saver Hero", savingsRate: 85, completedGoals: 5, completedChallenges: 12, currentStreak: 45, level: 8 },
    { id: "current", anonymousName: "Money Master", savingsRate: 72, completedGoals: 3, completedChallenges: 8, currentStreak: 23, level: 5 },
    { id: "user3", anonymousName: "Budget Boss", savingsRate: 68, completedGoals: 4, completedChallenges: 6, currentStreak: 19, level: 6 },
    { id: "user4", anonymousName: "Thrift King", savingsRate: 61, completedGoals: 2, completedChallenges: 9, currentStreak: 15, level: 4 },
  ]);

  const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleEditTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, ...updatedTransaction } : t)
    );
  };

  const handleAddCategory = (category: Omit<Category, "id">) => {
    const newCategory = {
      ...category,
      id: Date.now().toString()
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const handleAddRecurringExpense = (expense: Omit<RecurringExpense, "id">) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString()
    };
    setRecurringExpenses(prev => [...prev, newExpense]);
    setIsAddRecurringModalOpen(false);
  };

  const handleToggleRecurringExpense = (id: string, isActive: boolean) => {
    setRecurringExpenses(prev => 
      prev.map(expense => expense.id === id ? { ...expense, isActive } : expense)
    );
  };

  const handleDeleteRecurringExpense = (id: string) => {
    setRecurringExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const handleUpdateRecurringExpense = (id: string, updates: Partial<RecurringExpense>) => {
    setRecurringExpenses(prev => 
      prev.map(expense => expense.id === id ? { ...expense, ...updates } : expense)
    );
  };

  const handleAddSavingsGoal = (goal: Omit<SavingsGoal, "id">) => {
    const newGoal = {
      ...goal,
      id: Date.now().toString()
    };
    setSavingsGoals(prev => [...prev, newGoal]);
    toast.success("Savings goal created! Start working towards it!");
  };

  const handleUpdateGoal = (id: string, amount: number) => {
    setSavingsGoals(prev => 
      prev.map(goal => {
        if (goal.id === id) {
          const newAmount = goal.currentAmount + amount;
          const isCompleted = newAmount >= goal.targetAmount;
          
          if (isCompleted && !goal.isCompleted) {
            toast.success("🎉 Congratulations! You've completed your savings goal!");
          }
          
          return { 
            ...goal, 
            currentAmount: Math.min(newAmount, goal.targetAmount),
            isCompleted 
          };
        }
        return goal;
      })
    );
  };

  const handleJoinChallenge = (id: string) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === id 
          ? { ...challenge, isActive: true, participants: challenge.participants + 1 }
          : challenge
      )
    );
    toast.success("Challenge joined! Good luck!");
  };

  const handleLeaveChallenge = (id: string) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === id 
          ? { ...challenge, isActive: false, participants: Math.max(0, challenge.participants - 1) }
          : challenge
      )
    );
    toast.info("You've left the challenge.");
  };

  useRecurringExpenses({
    recurringExpenses,
    onAddTransaction: handleAddTransaction,
    onUpdateRecurringExpense: handleUpdateRecurringExpense
  });

  const currentUserLevel = 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <DashboardHeader 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onAddTransaction={() => setIsAddModalOpen(true)}
        />
        
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <ExpenseStats transactions={transactions} />
            <ExpenseChart transactions={transactions} categories={categories} />
          </div>
        )}

        {activeTab === "transactions" && (
          <TransactionList 
            transactions={transactions}
            categories={categories}
            onDelete={handleDeleteTransaction}
            onEdit={handleEditTransaction}
            showAll={true}
          />
        )}

        {activeTab === "categories" && (
          <CategoryManager 
            categories={categories}
            onAdd={handleAddCategory}
            onDelete={handleDeleteCategory}
          />
        )}

        {activeTab === "recurring" && (
          <RecurringExpenseManager
            recurringExpenses={recurringExpenses}
            categories={categories}
            onToggle={handleToggleRecurringExpense}
            onDelete={handleDeleteRecurringExpense}
            onAddNew={() => setIsAddRecurringModalOpen(true)}
          />
        )}

        {activeTab === "goals" && (
          <SavingsGoals
            goals={savingsGoals}
            onAddGoal={() => setIsAddGoalModalOpen(true)}
            onUpdateGoal={handleUpdateGoal}
          />
        )}

        {activeTab === "challenges" && (
          <Challenges
            challenges={challenges}
            onJoinChallenge={handleJoinChallenge}
            onLeaveChallenge={handleLeaveChallenge}
          />
        )}

        {activeTab === "badges" && (
          <BadgesShowcase
            badges={badges}
            userLevel={currentUserLevel}
          />
        )}

        {activeTab === "leaderboard" && (
          <Leaderboard
            entries={leaderboardEntries}
            currentUserId="current"
          />
        )}

        <AddTransactionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddTransaction}
          categories={categories}
        />

        <AddRecurringExpenseModal
          isOpen={isAddRecurringModalOpen}
          onClose={() => setIsAddRecurringModalOpen(false)}
          onAdd={handleAddRecurringExpense}
          categories={categories}
        />

        <AddSavingsGoalModal
          isOpen={isAddGoalModalOpen}
          onClose={() => setIsAddGoalModalOpen(false)}
          onAdd={handleAddSavingsGoal}
          categories={categories}
        />
      </div>
    </div>
  );
};

export default Index;
