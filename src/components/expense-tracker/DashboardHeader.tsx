
import { Button } from "@/components/ui/button";
import { Plus, BarChart3, List, Tags, RefreshCw, Target, Zap, Award, Trophy } from "lucide-react";

interface DashboardHeaderProps {
  activeTab: "dashboard" | "transactions" | "categories" | "recurring" | "goals" | "challenges" | "badges" | "leaderboard";
  setActiveTab: (tab: "dashboard" | "transactions" | "categories" | "recurring" | "goals" | "challenges" | "badges" | "leaderboard") => void;
  onAddTransaction: () => void;
}

export const DashboardHeader = ({ activeTab, setActiveTab, onAddTransaction }: DashboardHeaderProps) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "transactions", label: "Transactions", icon: List },
    { id: "categories", label: "Categories", icon: Tags },
    { id: "recurring", label: "Recurring", icon: RefreshCw },
    { id: "goals", label: "Goals", icon: Target },
    { id: "challenges", label: "Challenges", icon: Zap },
    { id: "badges", label: "Badges", icon: Award },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  ] as const;

  return (
    <div className="flex flex-col gap-6 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            SpendWise
          </h1>
          <p className="text-gray-600">Master your finances with gamified savings & smart tracking</p>
        </div>
        
        <Button onClick={onAddTransaction} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg">
          <Plus size={16} className="mr-2" />
          Add Transaction
        </Button>
      </div>
      
      <div className="flex overflow-x-auto bg-white rounded-xl p-2 shadow-lg border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md transform scale-105"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
