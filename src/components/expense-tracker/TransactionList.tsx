
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Transaction, Category } from "@/types/expense-tracker";

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onDelete: (id: string) => void;
  onEdit: (id: string, transaction: Partial<Transaction>) => void;
  showAll: boolean;
}

export const TransactionList = ({ 
  transactions, 
  categories, 
  onDelete, 
  onEdit, 
  showAll 
}: TransactionListProps) => {
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

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">
          {showAll ? "All Transactions" : "Recent Transactions"}
        </h3>
        {!showAll && transactions.length > 5 && (
          <Button variant="outline" size="sm">
            View All
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No transactions found</p>
            <p className="text-sm">Add your first transaction to get started</p>
          </div>
        ) : (
          transactions.map((transaction) => {
            const categoryInfo = getCategoryInfo(transaction.category);
            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: categoryInfo.color }}
                  >
                    {categoryInfo.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {transaction.description}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {transaction.category}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`flex items-center gap-1 font-semibold ${
                      transaction.type === "income" ? "text-green-600" : "text-red-600"
                    }`}>
                      {transaction.type === "income" ? (
                        <ArrowUpRight size={16} />
                      ) : (
                        <ArrowDownRight size={16} />
                      )}
                      ₹{transaction.amount.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newDescription = prompt("Edit description:", transaction.description);
                        if (newDescription) {
                          onEdit(transaction.id, { description: newDescription });
                        }
                      }}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this transaction?")) {
                          onDelete(transaction.id);
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
  );
};
