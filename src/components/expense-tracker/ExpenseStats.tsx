
import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp } from "lucide-react";
import { Transaction } from "@/types/expense-tracker";

interface ExpenseStatsProps {
  transactions: Transaction[];
}

export const ExpenseStats = ({ transactions }: ExpenseStatsProps) => {
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;
  
  const stats = [
    {
      title: "Total Income",
      value: totalIncome,
      icon: ArrowUpRight,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "Total Expenses",
      value: totalExpenses,
      icon: ArrowDownRight,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      title: "Balance",
      value: balance,
      icon: Wallet,
      color: balance >= 0 ? "text-blue-600" : "text-red-600",
      bgColor: balance >= 0 ? "bg-blue-50" : "bg-red-50",
      borderColor: balance >= 0 ? "border-blue-200" : "border-red-200"
    },
    {
      title: "Transactions",
      value: transactions.length,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      isCount: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className={`p-6 ${stat.bgColor} border ${stat.borderColor} hover:shadow-lg transition-all duration-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.isCount ? stat.value : `₹${stat.value.toFixed(2)}`}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
