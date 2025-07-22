
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Receipt } from "lucide-react";
import { Transaction, Category } from "@/types/expense-tracker";
import { ReceiptUpload } from "./ReceiptUpload";
import { toast } from "@/components/ui/sonner";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: Omit<Transaction, "id">) => void;
  categories: Category[];
}

export const AddTransactionModal = ({ isOpen, onClose, onAdd, categories }: AddTransactionModalProps) => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    type: "expense" as "income" | "expense"
  });

  const [isReceiptUploadOpen, setIsReceiptUploadOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description && formData.amount && formData.category) {
      onAdd({
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        type: formData.type
      });
      setFormData({
        description: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split('T')[0],
        type: "expense"
      });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split('T')[0],
      type: "expense"
    });
    onClose();
  };

  const handleReceiptProcessed = (receiptData: {
    description: string;
    amount: number;
    date: string;
  }) => {
    console.log("Receipt processed:", receiptData);
    setFormData(prev => ({
      ...prev,
      description: receiptData.description,
      amount: receiptData.amount.toString(),
      date: receiptData.date,
      type: "expense" // Receipts are typically expenses
    }));
    
    // Try to auto-select category based on description
    const description = receiptData.description.toLowerCase();
    let suggestedCategory = "";
    
    if (description.includes("restaurant") || description.includes("cafe") || description.includes("food")) {
      suggestedCategory = "Food";
    } else if (description.includes("fuel") || description.includes("petrol") || description.includes("gas")) {
      suggestedCategory = "Transport";
    } else if (description.includes("mall") || description.includes("store") || description.includes("shop")) {
      suggestedCategory = "Shopping";
    }
    
    if (suggestedCategory && categories.some(cat => cat.name === suggestedCategory)) {
      setFormData(prev => ({ ...prev, category: suggestedCategory }));
    }
    
    toast.success("Receipt data auto-filled! Please review and adjust if needed.");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
          </DialogHeader>
          
          <div className="mb-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsReceiptUploadOpen(true)}
              className="w-full"
            >
              <Receipt className="mr-2 h-4 w-4" />
              Upload Receipt to Auto-Fill
            </Button>
          </div>
          
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
                placeholder="Enter description"
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
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Add Transaction
              </Button>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ReceiptUpload
        isOpen={isReceiptUploadOpen}
        onClose={() => setIsReceiptUploadOpen(false)}
        onReceiptProcessed={handleReceiptProcessed}
      />
    </>
  );
};
