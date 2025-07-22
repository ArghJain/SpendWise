
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, AreaChart, Area } from "recharts";
import { Transaction, Category } from "@/types/expense-tracker";

interface ExpenseChartProps {
  transactions: Transaction[];
  categories: Category[];
}

export const ExpenseChart = ({ transactions, categories }: ExpenseChartProps) => {
  const expenseTransactions = transactions.filter(t => t.type === "expense");
  
  // Pie chart data - expenses by category
  const categoryData = categories.map(category => {
    const categoryExpenses = expenseTransactions
      .filter(t => t.category === category.name)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      name: category.name,
      value: categoryExpenses,
      color: category.color,
      icon: category.icon
    };
  }).filter(item => item.value > 0);

  // Monthly trend data for the last 6 months
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthKey = date.toISOString().slice(0, 7);
    
    const monthExpenses = expenseTransactions
      .filter(t => t.date.startsWith(monthKey))
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthIncome = transactions
      .filter(t => t.type === "income" && t.date.startsWith(monthKey))
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      expenses: monthExpenses,
      income: monthIncome,
      savings: Math.max(0, monthIncome - monthExpenses)
    };
  });

  // Daily expenses for last 14 days
  const dailyData = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    const dateKey = date.toISOString().split('T')[0];
    
    const dayExpenses = expenseTransactions
      .filter(t => t.date === dateKey)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      date: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      expenses: dayExpenses
    };
  });

  // Income vs Expenses comparison
  const comparisonData = categories.map(category => {
    const categoryExpenses = expenseTransactions
      .filter(t => t.category === category.name)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const budgetLimit = categoryExpenses * 1.2; // Simulated budget
    
    return {
      category: category.name,
      actual: categoryExpenses,
      budget: budgetLimit,
      color: category.color
    };
  }).filter(item => item.actual > 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: ₹{entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Distribution */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <h3 className="text-lg font-semibold mb-4 text-blue-800">Expenses by Category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Monthly Trends */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <h3 className="text-lg font-semibold mb-4 text-green-800">6-Month Financial Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Area dataKey="income" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              <Area dataKey="expenses" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
              <Area dataKey="savings" stackId="3" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Daily Spending Pattern */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
        <h3 className="text-lg font-semibold mb-4 text-purple-800">Daily Spending (Last 14 Days)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="expenses" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Budget vs Actual */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <h3 className="text-lg font-semibold mb-4 text-orange-800">Budget vs Actual Spending</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="budget" fill="#FCD34D" name="Budget" />
              <Bar dataKey="actual" fill="#F59E0B" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
