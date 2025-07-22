
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Zap, Award, Calendar } from "lucide-react";
import { Challenge } from "@/types/expense-tracker";

interface ChallengesProps {
  challenges: Challenge[];
  onJoinChallenge: (id: string) => void;
  onLeaveChallenge: (id: string) => void;
}

export const Challenges = ({ challenges, onJoinChallenge, onLeaveChallenge }: ChallengesProps) => {
  const calculateProgress = (challenge: Challenge) => {
    return Math.min((challenge.currentValue / challenge.targetValue) * 100, 100);
  };

  const getDaysRemaining = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'no-spend': return '🚫';
      case 'reduce-category': return '📉';
      case 'save-amount': return '💰';
      case 'streak': return '🔥';
      default: return '⭐';
    }
  };

  const getChallengeColor = (type: string) => {
    switch (type) {
      case 'no-spend': return 'from-red-50 to-pink-50 border-red-200';
      case 'reduce-category': return 'from-orange-50 to-yellow-50 border-orange-200';
      case 'save-amount': return 'from-green-50 to-emerald-50 border-green-200';
      case 'streak': return 'from-purple-50 to-violet-50 border-purple-200';
      default: return 'from-blue-50 to-indigo-50 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Challenges</h2>
        <Badge variant="outline" className="px-3 py-1">
          <Zap size={14} className="mr-1" />
          {challenges.filter(c => c.isActive).length} Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge) => {
          const progress = calculateProgress(challenge);
          const daysRemaining = getDaysRemaining(challenge.endDate);
          const isUserParticipating = challenge.isActive; // This would be based on user data in real app
          
          return (
            <Card key={challenge.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg bg-gradient-to-br ${getChallengeColor(challenge.type)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getChallengeIcon(challenge.type)}</div>
                    <div>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <p className="text-sm text-gray-600">{challenge.description}</p>
                    </div>
                  </div>
                  {challenge.isCompleted && (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      <Award size={12} className="mr-1" />
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
                    <span>{challenge.currentValue} / {challenge.targetValue}</span>
                    <span>{challenge.type === 'streak' ? 'days' : challenge.type === 'save-amount' ? '₹' : 'times'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar size={14} />
                    <span>{daysRemaining} days left</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Users size={14} />
                    <span>{challenge.participants} participants</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {isUserParticipating ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => onLeaveChallenge(challenge.id)}
                    >
                      Leave Challenge
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={() => onJoinChallenge(challenge.id)}
                    >
                      Join Challenge
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
