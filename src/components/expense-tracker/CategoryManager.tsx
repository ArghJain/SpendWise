
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { Category } from "@/types/expense-tracker";

interface CategoryManagerProps {
  categories: Category[];
  onAdd: (category: Omit<Category, "id">) => void;
  onDelete: (id: string) => void;
}

export const CategoryManager = ({ categories, onAdd, onDelete }: CategoryManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "#6366F1",
    icon: "📊"
  });

  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", 
    "#FECA57", "#48CAE4", "#6366F1", "#8B5CF6",
    "#F59E0B", "#EF4444", "#10B981", "#3B82F6"
  ];

  const icons = ["💰", "🍔", "🚗", "🎬", "🛍️", "📄", "🏠", "⚡", "🎮", "📚", "🏥", "✈️"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.name.trim()) {
      onAdd(newCategory);
      setNewCategory({ name: "", color: "#6366F1", icon: "📊" });
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Manage Categories</h3>
          <Button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Plus size={16} className="mr-2" />
            Add Category
          </Button>
        </div>

        {isAdding && (
          <Card className="p-4 mb-6 bg-gray-50">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div>
                <Label>Choose Color</Label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        newCategory.color === color ? "border-gray-800" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label>Choose Icon</Label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {icons.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg ${
                        newCategory.icon === icon ? "border-gray-800 bg-gray-100" : "border-gray-300"
                      }`}
                      onClick={() => setNewCategory(prev => ({ ...prev, icon }))}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Add Category</Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon}
                  </div>
                  <span className="font-medium">{category.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${category.name}" category?`)) {
                      onDelete(category.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};
