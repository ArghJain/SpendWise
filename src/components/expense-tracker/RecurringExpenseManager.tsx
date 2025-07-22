
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Trash2, Calendar, AlertTriangle, Plus } from "lucide-react";
import { RecurringExpense, Category } from "@/types/expense-tracker";

interface RecurringExpenseManagerProps {
  recurringExpenses: RecurringExpense[];
  categories: Category[];
  onToggle: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export const RecurringExpenseManager = ({ 
  recurringExpenses, 
  categories, 
  onToggle, 
  onDelete,
  onAddNew 
}: RecurringExpenseManagerProps) => {
  const getCategoryInfo = (categoryName: string) => {
    return categories.find(c => c.name === categoryName) || 
           { color: "#6B7280", icon: "📊" };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dateString: string) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUpcomingExpenses = () => {
    return recurringExpenses
      .filter(expense => expense.isActive)
      .filter(expense => getDaysUntilDue(expense.nextDueDate) <= 7)
      .sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime());
  };

  const upcomingExpenses = getUpcomingExpenses();

  return (
    <div className="space-y-6">
      {/* Upcoming Reminders */}
      {upcomingExpenses.length > 0 && (
        <Card className="p-6 bg-amber-50 border-amber-200">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-semibold text-amber-800">Upcoming Recurring Expenses</h3>
          </div>
          <div className="space-y-2">
            {upcomingExpenses.map((expense) => {
              const daysUntil = getDaysUntilDue(expense.nextDueDate);
              return (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                      style={{ backgroundColor: getCategoryInfo(expense.category).color }}
                    >
                      {getCategoryInfo(expense.category).icon}
                    </div>
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-gray-600">₹{expense.amount.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-amber-700">
                      {daysUntil === 0 ? "Due Today" : 
                       daysUntil === 1 ? "Due Tomorrow" : 
                       `Due in ${daysUntil} days`}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(expense.nextDueDate)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Recurring Expenses List */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Recurring Expenses</h3>
          <Button onClick={onAddNew} size="sm">
            <Plus size={16} className="mr-2" />
            Add Recurring Expense
          </Button>
        </div>
        
        <div className="space-y-3">
          {recurringExpenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recurring expenses set up</p>
              <p className="text-sm">Add recurring expenses to automate your monthly bills</p>
            </div>
          ) : (
            recurringExpenses.map((expense) => {
              const categoryInfo = getCategoryInfo(expense.category);
              const daysUntil = getDaysUntilDue(expense.nextDueDate);
              
              return (
                <div
                  key={expense.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    expense.isActive ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: categoryInfo.color }}
                    >
                      {categoryInfo.icon}
                    </div>
                    <div>
                      <h4 className={`font-medium ${expense.isActive ? "text-gray-900" : "text-gray-500"}`}>
                        {expense.description}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {expense.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {expense.frequency}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Next: {formatDate(expense.nextDueDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`font-semibold ${
                        expense.type === "income" ? "text-green-600" : "text-red-600"
                      }`}>
                        ₹{expense.amount.toFixed(2)}
                      </div>
                      {expense.isActive && daysUntil <= 3 && (
                        <div className="text-xs text-amber-600">
                          Due {daysUntil === 0 ? "today" : `in ${daysUntil} days`}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={expense.isActive}
                        onCheckedChange={(checked) => onToggle(expense.id, checked)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this recurring expense?")) {
                            onDelete(expense.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
};
