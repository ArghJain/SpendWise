
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, Trophy, Clock } from "lucide-react";
import { SavingsGoal } from "@/types/expense-tracker";

interface SavingsGoalsProps {
  goals: SavingsGoal[];
  onAddGoal: () => void;
  onUpdateGoal: (id: string, amount: number) => void;
}

export const SavingsGoals = ({ goals, onAddGoal, onUpdateGoal }: SavingsGoalsProps) => {
  const calculateProgress = (goal: SavingsGoal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Savings Goals</h2>
        <Button onClick={onAddGoal} className="bg-green-600 hover:bg-green-700">
          <Plus size={16} className="mr-2" />
          Add Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress = calculateProgress(goal);
          const daysRemaining = getDaysRemaining(goal.targetDate);
          
          return (
            <Card key={goal.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${goal.isCompleted ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg`} style={{ backgroundColor: goal.color + '20' }}>
                      <span className="text-xl">{goal.icon}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <p className="text-sm text-gray-600">{goal.category}</p>
                    </div>
                  </div>
                  {goal.isCompleted && (
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      <Trophy size={12} className="mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{goal.currentAmount.toLocaleString()}</span>
                    <span>₹{goal.targetAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock size={14} />
                    <span>{daysRemaining} days left</span>
                  </div>
                  <div className="text-gray-600">
                    ₹{(goal.targetAmount - goal.currentAmount).toLocaleString()} to go
                  </div>
                </div>

                {!goal.isCompleted && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      const amount = prompt("Add amount to this goal:");
                      if (amount && !isNaN(parseFloat(amount))) {
                        onUpdateGoal(goal.id, parseFloat(amount));
                      }
                    }}
                  >
                    <Target size={14} className="mr-1" />
                    Add Contribution
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
