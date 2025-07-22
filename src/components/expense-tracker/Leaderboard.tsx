
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, TrendingUp, Target, Zap } from "lucide-react";
import { LeaderboardEntry } from "@/types/expense-tracker";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId: string;
}

export const Leaderboard = ({ entries, currentUserId }: LeaderboardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="text-yellow-500" size={20} />;
      case 2: return <Medal className="text-gray-400" size={20} />;
      case 3: return <Award className="text-amber-600" size={20} />;
      default: return <span className="text-gray-500 font-bold">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-50 to-orange-50 border-yellow-300';
      case 2: return 'from-gray-50 to-slate-50 border-gray-300';
      case 3: return 'from-amber-50 to-orange-50 border-amber-300';
      default: return 'from-blue-50 to-indigo-50 border-blue-200';
    }
  };

  // Sort entries by a combined score
  const sortedEntries = [...entries].sort((a, b) => {
    const scoreA = (a.savingsRate * 0.4) + (a.completedGoals * 10) + (a.completedChallenges * 15) + (a.currentStreak * 2);
    const scoreB = (b.savingsRate * 0.4) + (b.completedGoals * 10) + (b.completedChallenges * 15) + (b.currentStreak * 2);
    return scoreB - scoreA;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Community Leaderboard</h2>
        <Badge variant="outline" className="px-3 py-1">
          <TrendingUp size={14} className="mr-1" />
          Anonymous & Optional
        </Badge>
      </div>

      <div className="space-y-3">
        {sortedEntries.map((entry, index) => {
          const rank = index + 1;
          const isCurrentUser = entry.id === currentUserId;
          
          return (
            <Card 
              key={entry.id} 
              className={`transition-all duration-300 hover:shadow-md ${isCurrentUser ? 'ring-2 ring-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50' : `bg-gradient-to-r ${getRankColor(rank)}`}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12">
                      {getRankIcon(rank)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        {entry.anonymousName}
                        {isCurrentUser && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">You</Badge>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">Level {entry.level}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp size={14} />
                        <span className="font-semibold">{entry.savingsRate}%</span>
                      </div>
                      <p className="text-gray-500 text-xs">Savings Rate</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-blue-600">
                        <Target size={14} />
                        <span className="font-semibold">{entry.completedGoals}</span>
                      </div>
                      <p className="text-gray-500 text-xs">Goals</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-purple-600">
                        <Award size={14} />
                        <span className="font-semibold">{entry.completedChallenges}</span>
                      </div>
                      <p className="text-gray-500 text-xs">Challenges</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-orange-600">
                        <Zap size={14} />
                        <span className="font-semibold">{entry.currentStreak}</span>
                      </div>
                      <p className="text-gray-500 text-xs">Streak</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
