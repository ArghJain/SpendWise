
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SavingsGoal, Category } from "@/types/expense-tracker";

interface AddSavingsGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (goal: Omit<SavingsGoal, "id">) => void;
  categories: Category[];
}

export const AddSavingsGoalModal = ({ isOpen, onClose, onAdd, categories }: AddSavingsGoalModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    targetDate: "",
    category: "",
    icon: "🎯",
    color: "#3B82F6"
  });

  const goalTemplates = [
    { title: "Emergency Fund", icon: "🏦", color: "#10B981" },
    { title: "New Phone", icon: "📱", color: "#8B5CF6" },
    { title: "Vacation", icon: "✈️", color: "#F59E0B" },
    { title: "Car Down Payment", icon: "🚗", color: "#EF4444" },
    { title: "Home Appliance", icon: "🏠", color: "#06B6D4" },
    { title: "Education", icon: "📚", color: "#84CC16" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.targetAmount && formData.targetDate && formData.category) {
      onAdd({
        title: formData.title,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: 0,
        targetDate: formData.targetDate,
        category: formData.category,
        icon: formData.icon,
        color: formData.color,
        isCompleted: false,
        createdAt: new Date().toISOString()
      });
      setFormData({
        title: "",
        targetAmount: "",
        targetDate: "",
        category: "",
        icon: "🎯",
        color: "#3B82F6"
      });
      onClose();
    }
  };

  const handleTemplateSelect = (template: typeof goalTemplates[0]) => {
    setFormData(prev => ({
      ...prev,
      title: template.title,
      icon: template.icon,
      color: template.color
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Savings Goal</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Quick Templates</Label>
          <div className="grid grid-cols-3 gap-2">
            {goalTemplates.map((template) => (
              <Button
                key={template.title}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleTemplateSelect(template)}
                className="p-2 h-auto flex flex-col items-center gap-1"
              >
                <span className="text-lg">{template.icon}</span>
                <span className="text-xs">{template.title}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Save for new laptop"
              required
            />
          </div>

          <div>
            <Label htmlFor="targetAmount">Target Amount (₹)</Label>
            <Input
              id="targetAmount"
              type="number"
              min="1"
              value={formData.targetAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
              placeholder="50000"
              required
            />
          </div>

          <div>
            <Label htmlFor="targetDate">Target Date</Label>
            <Input
              id="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="🎯"
                maxLength={2}
              />
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Create Goal
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
