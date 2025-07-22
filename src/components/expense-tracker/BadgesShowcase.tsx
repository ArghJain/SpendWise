
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Trophy, Lock, Sparkles } from "lucide-react";
import { Badge } from "@/types/expense-tracker";

interface BadgesShowcaseProps {
  badges: Badge[];
  userLevel: number;
}

export const BadgesShowcase = ({ badges, userLevel }: BadgesShowcaseProps) => {
  const unlockedBadges = badges.filter(badge => badge.isUnlocked);
  const lockedBadges = badges.filter(badge => !badge.isUnlocked);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Achievement Badges</h2>
        <div className="flex items-center gap-4">
          <BadgeUI className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
            <Trophy size={14} className="mr-1" />
            Level {userLevel}
          </BadgeUI>
          <BadgeUI variant="outline" className="border-blue-300 text-blue-700">
            {unlockedBadges.length} / {badges.length} Unlocked
          </BadgeUI>
        </div>
      </div>

      {/* Unlocked Badges */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Sparkles className="text-yellow-500" size={20} />
          Unlocked Badges
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {unlockedBadges.map((badge) => (
            <Card key={badge.id} className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-lg transition-all duration-300">
              <div className="space-y-3">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl`} style={{ backgroundColor: badge.color + '20' }}>
                  {badge.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{badge.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                  {badge.unlockedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Unlocked: {new Date(badge.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Locked Badges */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Lock className="text-gray-500" size={20} />
          Locked Badges
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {lockedBadges.map((badge) => (
            <Card key={badge.id} className="text-center p-4 bg-gray-50 border-gray-200 opacity-75">
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-400 relative">
                  <Lock size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-600">{badge.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{badge.description}</p>
                  <p className="text-xs text-blue-600 mt-2 font-medium">{badge.requirement}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
