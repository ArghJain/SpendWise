
import { useEffect } from "react";
import { RecurringExpense, Transaction } from "@/types/expense-tracker";

interface UseRecurringExpensesProps {
  recurringExpenses: RecurringExpense[];
  onAddTransaction: (transaction: Omit<Transaction, "id">) => void;
  onUpdateRecurringExpense: (id: string, updates: Partial<RecurringExpense>) => void;
}

export const useRecurringExpenses = ({
  recurringExpenses,
  onAddTransaction,
  onUpdateRecurringExpense
}: UseRecurringExpensesProps) => {
  
  useEffect(() => {
    const checkAndProcessRecurringExpenses = () => {
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      
      recurringExpenses.forEach((expense) => {
        if (!expense.isActive) return;
        
        const dueDate = new Date(expense.nextDueDate);
        const isOverdue = dueDate <= today;
        
        if (isOverdue && expense.lastProcessed !== todayString) {
          // Create the transaction
          onAddTransaction({
            description: `${expense.description} (Auto-generated)`,
            amount: expense.amount,
            category: expense.category,
            date: todayString,
            type: expense.type
          });
          
          // Calculate next due date
          const nextDueDate = calculateNextDueDate(expense.frequency, expense.dayOfMonth || 1);
          
          // Update the recurring expense
          onUpdateRecurringExpense(expense.id, {
            lastProcessed: todayString,
            nextDueDate
          });
          
          console.log(`Auto-processed recurring expense: ${expense.description}`);
        }
      });
    };
    
    // Check immediately and then every hour
    checkAndProcessRecurringExpenses();
    const interval = setInterval(checkAndProcessRecurringExpenses, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [recurringExpenses, onAddTransaction, onUpdateRecurringExpense]);
  
  const calculateNextDueDate = (frequency: string, dayOfMonth: number) => {
    const now = new Date();
    let nextDate = new Date();
    
    switch (frequency) {
      case "weekly":
        nextDate.setDate(now.getDate() + 7);
        break;
      case "monthly":
        nextDate = new Date(now.getFullYear(), now.getMonth() + 1, dayOfMonth);
        break;
      case "yearly":
        nextDate = new Date(now.getFullYear() + 1, now.getMonth(), dayOfMonth);
        break;
      default:
        nextDate.setMonth(now.getMonth() + 1);
    }
    
    return nextDate.toISOString().split('T')[0];
  };
};
