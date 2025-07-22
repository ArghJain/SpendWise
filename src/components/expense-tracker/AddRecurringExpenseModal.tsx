
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RecurringExpense, Category } from "@/types/expense-tracker";

interface AddRecurringExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (expense: Omit<RecurringExpense, "id">) => void;
  categories: Category[];
}

export const AddRecurringExpenseModal = ({ isOpen, onClose, onAdd, categories }: AddRecurringExpenseModalProps) => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    type: "expense" as "income" | "expense",
    frequency: "monthly" as "monthly" | "weekly" | "yearly",
    dayOfMonth: "1"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description && formData.amount && formData.category) {
      const nextDueDate = calculateNextDueDate(formData.frequency, parseInt(formData.dayOfMonth));
      
      onAdd({
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        type: formData.type,
        frequency: formData.frequency,
        nextDueDate,
        isActive: true,
        dayOfMonth: parseInt(formData.dayOfMonth)
      });
      
      setFormData({
        description: "",
        amount: "",
        category: "",
        type: "expense",
        frequency: "monthly",
        dayOfMonth: "1"
      });
      onClose();
    }
  };

  const calculateNextDueDate = (frequency: string, dayOfMonth: number) => {
    const now = new Date();
    const nextDate = new Date(now.getFullYear(), now.getMonth(), dayOfMonth);
    
    if (nextDate <= now) {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }
    
    return nextDate.toISOString().split('T')[0];
  };

  const handleClose = () => {
    setFormData({
      description: "",
      amount: "",
      category: "",
      type: "expense",
      frequency: "monthly",
      dayOfMonth: "1"
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Recurring Expense</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: "income" | "expense") => 
                setFormData(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="e.g., Rent, Netflix Subscription"
              required
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.name}>
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Select 
              value={formData.frequency} 
              onValueChange={(value: "monthly" | "weekly" | "yearly") => 
                setFormData(prev => ({ ...prev, frequency: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.frequency === "monthly" && (
            <div>
              <Label htmlFor="dayOfMonth">Day of Month</Label>
              <Input
                id="dayOfMonth"
                type="number"
                min="1"
                max="31"
                value={formData.dayOfMonth}
                onChange={(e) => setFormData(prev => ({ ...prev, dayOfMonth: e.target.value }))}
                required
              />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Add Recurring Expense
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
